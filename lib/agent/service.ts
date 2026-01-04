import OpenAI from 'openai'
import { PrismaClient } from '@prisma/client'
import { 
  AgentRunInput, 
  AgentRunResult, 
  agentTools,
  IntakeAgentOutputSchema,
  PlannerAgentOutputSchema,
  OpsAgentOutputSchema,
  EmbedCopilotOutputSchema,
} from './types'
import { AGENT_SYSTEM_PROMPTS, buildAgentContext } from './prompts'

// Lazy-initialized OpenAI client
let _openai: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (!_openai) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY is missing. Please set it in your environment variables or Vercel project settings.'
      )
    }
    _openai = new OpenAI({
      apiKey,
      organization: process.env.OPENAI_ORG_ID,
    })
  }
  return _openai
}

// Lazy-initialized Prisma client
let _prisma: PrismaClient | null = null

function getPrisma(): PrismaClient {
  if (!_prisma) {
    _prisma = new PrismaClient()
  }
  return _prisma
}

// Tool execution handlers
async function searchProjects(args: any, ctx: { orgId: string; userId: string }) {
  if (args.org_id !== ctx.orgId) {
    throw new Error('Organization mismatch - access denied')
  }
  
  const prisma = getPrisma()
  const projects = await prisma.project.findMany({
    where: {
      orgId: args.org_id,
      name: { contains: args.query, mode: 'insensitive' },
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
    },
    take: 10,
  })
  
  return projects
}

async function searchUsers(args: any, ctx: { orgId: string; userId: string }) {
  if (args.org_id !== ctx.orgId) {
    throw new Error('Organization mismatch - access denied')
  }
  
  const prisma = getPrisma()
  const memberships = await prisma.membership.findMany({
    where: {
      orgId: args.org_id,
      deletedAt: null,
      user: {
        OR: [
          { name: { contains: args.query, mode: 'insensitive' } },
          { email: { contains: args.query, mode: 'insensitive' } },
        ],
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    take: 10,
  })
  
  return memberships.map(m => m.user)
}

async function createTask(args: any, ctx: { orgId: string; userId: string }) {
  if (args.org_id !== ctx.orgId) {
    throw new Error('Organization mismatch - access denied')
  }
  
  return {
    approval_required: true,
    action: 'create_task',
    data: args,
    message: 'タスク作成には承認が必要です',
  }
}

async function updateTask(args: any, ctx: { orgId: string; userId: string }) {
  const prisma = getPrisma()
  const task = await prisma.task.findUnique({
    where: { id: args.task_id },
    select: { orgId: true },
  })
  
  if (!task || task.orgId !== ctx.orgId) {
    throw new Error('Task not found or access denied')
  }
  
  return {
    approval_required: true,
    action: 'update_task',
    data: args,
    message: 'タスク更新には承認が必要です',
  }
}

async function createProject(args: any, ctx: { orgId: string; userId: string }) {
  if (args.org_id !== ctx.orgId) {
    throw new Error('Organization mismatch - access denied')
  }
  
  return {
    approval_required: true,
    action: 'create_project',
    data: args,
    message: 'プロジェクト作成には承認が必要です',
  }
}

async function logAgentNote(args: any, _ctx: { orgId: string; userId: string }) {
  return {
    success: true,
    note: args.note,
    task_id: args.task_id,
  }
}

const toolHandlers: Record<string, (args: any, ctx: { orgId: string; userId: string }) => Promise<any>> = {
  search_projects: searchProjects,
  search_users: searchUsers,
  create_task: createTask,
  update_task: updateTask,
  create_project: createProject,
  log_agent_note: logAgentNote,
}

// Execute agent
export async function runAgent(input: AgentRunInput): Promise<AgentRunResult> {
  const { type, input: userInput, orgId, userId, context } = input
  const prisma = getPrisma()
  
  try {
    // Create agent run record
    const agentRun = await prisma.agentRun.create({
      data: {
        orgId,
        userId,
        agentType: type,
        input: userInput,
        status: 'RUNNING',
        metadata: context?.metadata || {},
      },
    })

    // Build messages
    const systemPrompt = AGENT_SYSTEM_PROMPTS[type]
    const contextInfo = buildAgentContext(type, {
      orgId,
      userId,
      projectId: context?.projectId,
      currentDate: new Date().toISOString(),
    })

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt + '\n' + contextInfo },
      { role: 'user', content: userInput },
    ]

    // Get output schema based on agent type
    const outputSchema = getOutputSchema(type)

    // Call OpenAI
    const toolCalls: AgentRunResult['toolCalls'] = []
    const openai = getOpenAI()
    let response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      tools: agentTools,
      tool_choice: 'auto',
      response_format: { type: 'json_object' },
    })

    let assistantMessage = response.choices[0].message

    // Handle tool calls
    while (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      messages.push(assistantMessage)

      for (const toolCall of assistantMessage.tool_calls) {
        const toolName = toolCall.function.name
        const toolArgs = JSON.parse(toolCall.function.arguments)

        try {
          const handler = toolHandlers[toolName]
          if (!handler) {
            throw new Error(`Unknown tool: ${toolName}`)
          }

          const result = await handler(toolArgs, { orgId, userId })
          
          toolCalls.push({
            name: toolName,
            arguments: toolArgs,
            result,
          })

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          })
        } catch (error: any) {
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify({ error: error.message }),
          })
        }
      }

      // Continue conversation after tool calls
      response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        tools: agentTools,
        tool_choice: 'auto',
        response_format: { type: 'json_object' },
      })

      assistantMessage = response.choices[0].message
    }

    // Parse final output
    const content = assistantMessage.content
    if (!content) {
      throw new Error('Empty response from model')
    }

    const parsedOutput = JSON.parse(content)
    const validatedOutput = outputSchema.parse(parsedOutput)

    // Check if approval is required
    const approvalRequired = toolCalls.some(tc => tc.result?.approval_required)

    // Update agent run record
    await prisma.agentRun.update({
      where: { id: agentRun.id },
      data: {
        output: validatedOutput,
        status: approvalRequired ? 'APPROVAL_REQUIRED' : 'COMPLETED',
        approvalRequired,
        metadata: {
          ...agentRun.metadata as object,
          toolCalls,
          usage: response.usage ? {
            prompt_tokens: response.usage.prompt_tokens,
            completion_tokens: response.usage.completion_tokens,
            total_tokens: response.usage.total_tokens,
          } : null,
        },
      },
    })

    return {
      success: true,
      output: validatedOutput,
      approvalRequired,
      toolCalls,
      usage: response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      } : undefined,
    }
  } catch (error: any) {
    console.error('[Agent Service] error:', error)

    return {
      success: false,
      error: error.message || 'Unknown error',
    }
  }
}

// Get output schema based on agent type
function getOutputSchema(type: AgentRunInput['type']) {
  switch (type) {
    case 'INTAKE':
      return IntakeAgentOutputSchema
    case 'PLANNER':
      return PlannerAgentOutputSchema
    case 'OPS':
      return OpsAgentOutputSchema
    case 'EMBED_COPILOT':
      return EmbedCopilotOutputSchema
    default:
      throw new Error(`Unknown agent type: ${type}`)
  }
}

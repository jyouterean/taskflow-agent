import { z } from 'zod'

// Agent Types
export type AgentType = 'INTAKE' | 'PLANNER' | 'OPS' | 'EMBED_COPILOT'

// ============================================
// Intake Agent - Task Extraction
// ============================================

export const TaskDraftSchema = z.object({
  title: z.string().describe('タスクのタイトル'),
  description: z.string().optional().describe('タスクの詳細説明'),
  candidate_project: z.string().optional().describe('提案するプロジェクト名'),
  due_date_guess: z.string().optional().describe('推定期限（ISO 8601形式）'),
  priority_guess: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).describe('推定優先度'),
  assignee_guess: z.string().optional().describe('推定担当者名'),
  tags: z.array(z.string()).optional().describe('タグ候補'),
  confidence: z.number().min(0).max(1).describe('確信度（0-1）'),
  questions: z.array(z.string()).optional().describe('確認が必要な事項'),
  needs_clarification: z.boolean().describe('確認が必要かどうか'),
})

export const IntakeAgentOutputSchema = z.object({
  task_drafts: z.array(TaskDraftSchema),
  next_action: z.enum(['CREATE_TASKS', 'ASK_CLARIFY', 'PROPOSE_PROJECT']),
  summary: z.string().optional().describe('入力内容のサマリー'),
  reasoning: z.string().describe('判断の根拠'),
})

export type TaskDraft = z.infer<typeof TaskDraftSchema>
export type IntakeAgentOutput = z.infer<typeof IntakeAgentOutputSchema>

// ============================================
// Planner Agent - Project Planning / WBS
// ============================================

export const MilestoneSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  target_date: z.string().optional(),
  tasks: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    estimated_hours: z.number().optional(),
    dependencies: z.array(z.string()).optional(),
    assignee_suggestion: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  })),
})

export const PlannerAgentOutputSchema = z.object({
  project_name: z.string(),
  project_description: z.string(),
  objectives: z.array(z.string()),
  milestones: z.array(MilestoneSchema),
  risks: z.array(z.object({
    description: z.string(),
    mitigation: z.string().optional(),
    impact: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  })),
  assumptions: z.array(z.string()),
  total_estimated_hours: z.number().optional(),
  reasoning: z.string(),
})

export type Milestone = z.infer<typeof MilestoneSchema>
export type PlannerAgentOutput = z.infer<typeof PlannerAgentOutputSchema>

// ============================================
// Ops Agent - Daily Operations
// ============================================

export const OpsAgentOutputSchema = z.object({
  date: z.string(),
  summary: z.string(),
  today_focus: z.array(z.object({
    task_id: z.string().optional(),
    task_title: z.string(),
    reason: z.string(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  })),
  delays: z.array(z.object({
    task_id: z.string().optional(),
    task_title: z.string(),
    days_overdue: z.number(),
    suggested_action: z.string(),
  })),
  blockers: z.array(z.object({
    task_id: z.string().optional(),
    task_title: z.string(),
    blocker_reason: z.string(),
    suggested_action: z.string(),
  })),
  recommendations: z.array(z.object({
    type: z.enum(['PRIORITIZE', 'DELEGATE', 'RESCHEDULE', 'ESCALATE', 'CLARIFY']),
    description: z.string(),
    related_task_ids: z.array(z.string()).optional(),
  })),
  metrics: z.object({
    tasks_completed_this_week: z.number(),
    tasks_in_progress: z.number(),
    tasks_overdue: z.number(),
    completion_rate: z.number(),
  }).optional(),
})

export type OpsAgentOutput = z.infer<typeof OpsAgentOutputSchema>

// ============================================
// Embed Copilot Agent
// ============================================

export const EmbedCopilotOutputSchema = z.object({
  suggested_widget: z.object({
    name: z.string(),
    type: z.enum(['MY_TASKS', 'PROJECT', 'SAVED_FILTER']),
    view_mode: z.enum(['LIST', 'BOARD', 'MINI_DASHBOARD']),
    permissions: z.enum(['VIEW_ONLY', 'OPERATIONS_ALLOWED']),
    filter_suggestion: z.object({
      status: z.array(z.string()).optional(),
      priority: z.array(z.string()).optional(),
      due_date_range: z.string().optional(),
      assignee: z.string().optional(),
      project_id: z.string().optional(),
    }).optional(),
  }),
  explanation: z.string(),
  security_notes: z.array(z.string()),
  next_steps: z.array(z.string()),
})

export type EmbedCopilotOutput = z.infer<typeof EmbedCopilotOutputSchema>

// ============================================
// Tool Definitions for Function Calling
// ============================================

export const agentTools = [
  {
    type: 'function' as const,
    function: {
      name: 'search_projects',
      description: '組織内のプロジェクトを検索します',
      strict: true,
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: '検索クエリ' },
          org_id: { type: 'string', description: '組織ID' },
        },
        required: ['query', 'org_id'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'search_users',
      description: '組織内のユーザーを検索します',
      strict: true,
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: '検索クエリ（名前やメール）' },
          org_id: { type: 'string', description: '組織ID' },
        },
        required: ['query', 'org_id'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'create_task',
      description: '新しいタスクを作成します',
      strict: true,
      parameters: {
        type: 'object',
        properties: {
          org_id: { type: 'string', description: '組織ID' },
          project_id: { type: 'string', description: 'プロジェクトID（オプション）' },
          title: { type: 'string', description: 'タスクタイトル' },
          description: { type: 'string', description: 'タスク説明' },
          due_date: { type: 'string', description: '期限（ISO 8601形式）' },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], description: '優先度' },
          assignee_id: { type: 'string', description: '担当者ID' },
          tags: { type: 'array', items: { type: 'string' }, description: 'タグ' },
        },
        required: ['org_id', 'title', 'priority'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'update_task',
      description: '既存のタスクを更新します',
      strict: true,
      parameters: {
        type: 'object',
        properties: {
          task_id: { type: 'string', description: 'タスクID' },
          title: { type: 'string', description: '新しいタイトル' },
          description: { type: 'string', description: '新しい説明' },
          status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'CANCELLED'], description: '新しいステータス' },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], description: '新しい優先度' },
          due_date: { type: 'string', description: '新しい期限' },
          assignee_id: { type: 'string', description: '新しい担当者ID' },
        },
        required: ['task_id'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'create_project',
      description: '新しいプロジェクトを作成します',
      strict: true,
      parameters: {
        type: 'object',
        properties: {
          org_id: { type: 'string', description: '組織ID' },
          name: { type: 'string', description: 'プロジェクト名' },
          description: { type: 'string', description: 'プロジェクト説明' },
          owner_id: { type: 'string', description: 'オーナーID' },
        },
        required: ['org_id', 'name', 'owner_id'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'log_agent_note',
      description: 'エージェントの判断理由や根拠を記録します',
      strict: true,
      parameters: {
        type: 'object',
        properties: {
          task_id: { type: 'string', description: '関連タスクID' },
          note: { type: 'string', description: 'メモ内容' },
        },
        required: ['note'],
        additionalProperties: false,
      },
    },
  },
]

// ============================================
// Agent Run Types
// ============================================

export interface AgentRunInput {
  type: AgentType
  input: string
  orgId: string
  userId: string
  context?: {
    projectId?: string
    taskIds?: string[]
    metadata?: Record<string, any>
  }
}

export interface AgentRunResult {
  success: boolean
  output?: IntakeAgentOutput | PlannerAgentOutput | OpsAgentOutput | EmbedCopilotOutput
  error?: string
  approvalRequired?: boolean
  toolCalls?: Array<{
    name: string
    arguments: Record<string, any>
    result?: any
  }>
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}


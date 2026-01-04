# TaskFlow Agent - AI-Powered Task Management SaaS

企業向けOpenAI組み込みタスク管理エージェントSaaS。ToDo・プロジェクト管理・AI自動化・Embed機能を統合したプラットフォーム。

## 🚀 主な機能

### タスク管理
- **個人ToDo**: 自分のタスクを効率的に管理
- **プロジェクト管理**: チームでの協業をサポート
- **複数ビュー**: リスト / ボード / タイムライン / カレンダー
- **フィルタ・検索**: 高度な絞り込み機能

### AIエージェント
- **Intake Agent**: 会議録・チャット・文書からタスクを自動抽出
- **Planner Agent**: プロジェクト計画・WBS作成
- **Ops Agent**: 日次レポート・遅延検知・次アクション提案
- **Embed Copilot**: 埋め込み設定アシスト

### Embed（埋め込み）
- 社内ポータル・CRM・業務システムにタスクUIを埋め込み
- iframeによる配信
- ドメイン制限（ホワイトリスト方式）
- トークン認証 / 権限制御

### エンタープライズ機能
- **RBAC**: Admin / Manager / Member の3ロール
- **監査ログ**: 全操作を記録・追跡
- **Human-in-the-loop**: 破壊的操作は承認必須
- **SSO**: Google / SAML対応

## 🛠️ 技術スタック

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Radix UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: OpenAI API (GPT-4o, Function Calling, Structured Outputs)

## 📦 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env` ファイルを作成し、以下の変数を設定:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/taskflow_agent"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"
OPENAI_ORG_ID="org-your-org-id"

# App
APP_URL="http://localhost:3000"
```

### 3. データベースのセットアップ

```bash
# Prismaクライアント生成
npm run db:generate

# データベースマイグレーション
npm run db:push
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

## 📁 プロジェクト構造

```
├── app/
│   ├── (public)/           # 公開サイト (LP, Features, Pricing, etc.)
│   ├── (auth)/             # 認証ページ (Login, Signup)
│   ├── app/                # アプリケーション本体
│   │   ├── dashboard/      # ダッシュボード
│   │   ├── tasks/          # タスク管理
│   │   ├── projects/       # プロジェクト管理
│   │   ├── agent/          # AIエージェント
│   │   └── settings/       # 設定
│   ├── embed/              # Embed配信
│   └── api/                # APIルート
├── components/
│   ├── ui/                 # UIコンポーネント
│   ├── layout/             # レイアウトコンポーネント
│   └── embed/              # Embed用コンポーネント
├── lib/
│   ├── agent/              # AIエージェント関連
│   ├── auth.ts             # 認証ユーティリティ
│   ├── rbac.ts             # 権限管理
│   ├── audit.ts            # 監査ログ
│   └── prisma.ts           # Prismaクライアント
└── prisma/
    └── schema.prisma       # データベーススキーマ
```

## 🔐 セキュリティ

### AIエージェントの安全装置

1. **Tool呼び出しは権限チェック済みの内部APIのみ**
   - モデルは直接DBを書かない
   - すべて `POST /internal/tools/*` へ → サーバでRBAC & テナント境界を検証

2. **破壊的操作は承認必須（Human-in-the-loop）**
   - delete / 一括変更 / 権限変更 / embed権限"操作可"付与
   - `approval_required=true` を返し、UIで管理者承認後に実行

3. **Structured Outputsで「壊れないJSON」**
   - エージェントの最終出力はJSON Schema固定
   - tool引数は `strict: true` を使い、Schema逸脱を防ぐ

### Embedセキュリティ

- **ドメイン制限**: `frame-ancestors` CSPで許可ドメイン以外からの埋め込みを遮断
- **トークン認証**: スコープ（対象プロジェクト/フィルタ + 権限）を必須
- **監査ログ**: どのwidgetがいつ表示/操作されたかを記録

## 📖 API リファレンス

### Tasks API

```
GET    /api/tasks          # タスク一覧
POST   /api/tasks          # タスク作成
GET    /api/tasks/:id      # タスク詳細
PATCH  /api/tasks/:id      # タスク更新
DELETE /api/tasks/:id      # タスク削除
```

### Projects API

```
GET    /api/projects       # プロジェクト一覧
POST   /api/projects       # プロジェクト作成
```

### Agent API

```
POST   /api/agent/run      # エージェント実行
```

### Embeds API

```
GET    /api/embeds         # Embed一覧
POST   /api/embeds         # Embed作成
```

## 🤖 AIエージェント使用例

### Intake Agent（タスク抽出）

```typescript
const result = await fetch('/api/agent/run', {
  method: 'POST',
  body: JSON.stringify({
    type: 'INTAKE',
    input: '今日のMTGで決まったこと：田中さんが来週までにデザイン案を作成',
  }),
})

// 出力例
{
  "task_drafts": [
    {
      "title": "デザイン案作成",
      "assignee_guess": "田中",
      "due_date_guess": "2026-01-11",
      "priority_guess": "HIGH",
      "confidence": 0.9
    }
  ],
  "next_action": "CREATE_TASKS"
}
```

### Planner Agent（プロジェクト計画）

```typescript
const result = await fetch('/api/agent/run', {
  method: 'POST',
  body: JSON.stringify({
    type: 'PLANNER',
    input: '新規Webアプリ開発プロジェクトを計画してください',
  }),
})
```

## 📜 ライセンス

MIT License

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) - AI API
- [Vercel](https://vercel.com/) - Hosting & Next.js
- [Prisma](https://www.prisma.io/) - ORM
- [Radix UI](https://www.radix-ui.com/) - UI Components


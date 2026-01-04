# 環境変数セットアップガイド

サインアップエラーを解決するために、`.env`ファイルを作成して環境変数を設定してください。

## 1. .envファイルの作成

プロジェクトルートに `.env` ファイルを作成してください。

```bash
touch .env
```

## 2. 環境変数の設定

`.env` ファイルに以下の内容を追加してください：

```env
# Database (Neon PostgreSQL)
# Neon Console (https://console.neon.tech) から接続文字列を取得して貼り付け
DATABASE_URL="postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="mERvVacx3NyRToj6A11Xc2LwX9KTirf/qrNvduZV8rQ="
# または新しいシークレットを生成: openssl rand -base64 32

# OpenAI (オプション - AI機能を使用する場合)
OPENAI_API_KEY=""
OPENAI_ORG_ID=""

# App
APP_URL="http://localhost:3000"
APP_ENV="development"
```

## 3. Neonデータベースのセットアップ

### ステップ1: Neonアカウントの作成

1. [Neon Console](https://console.neon.tech) にアクセス
2. アカウントを作成（GitHub推奨）

### ステップ2: データベースプロジェクトの作成

1. 「Create Project」をクリック
2. プロジェクト名を入力（例: `taskflow-agent`）
3. リージョンを選択
4. 「Create Project」をクリック

### ステップ3: 接続文字列の取得

1. プロジェクトダッシュボードで「Connection Details」を開く
2. 「Connection string」セクションから接続文字列をコピー
3. `.env` ファイルの `DATABASE_URL` に貼り付け

接続文字列の形式：
```
postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## 4. データベーススキーマの適用

`.env` ファイルを設定したら、以下のコマンドを実行してください：

```bash
# Prismaクライアントを生成
npm run db:generate

# データベースにスキーマを適用
npm run db:push
```

## 5. 接続確認

データベース接続を確認：

```bash
# ヘルスチェックエンドポイントにアクセス
curl http://localhost:3000/api/health
```

または、開発サーバーを起動してブラウザで確認：

```bash
npm run dev
```

ブラウザで `http://localhost:3000/api/health` を開いて、`"status": "ok"` が返ってくることを確認してください。

## 6. サインアップの再試行

上記の手順を完了したら、サインアップを再度お試しください。

## トラブルシューティング

### エラー: "DATABASE_URL is not set"
- `.env` ファイルがプロジェクトルートに存在するか確認
- `.env` ファイルに `DATABASE_URL` が正しく設定されているか確認

### エラー: "Can't reach database server"
- Neonの接続文字列が正しいか確認
- 接続文字列に `?sslmode=require` が含まれているか確認
- Neon Consoleでデータベースがアクティブか確認

### エラー: "passwordHash does not exist"
- `npm run db:push` を実行してスキーマを適用してください


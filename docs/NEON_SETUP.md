# Neon データベース設定ガイド

このプロジェクトは [Neon](https://neon.tech) を使用してPostgreSQLデータベースをホストします。

## 1. Neonアカウントの作成

1. [Neon Console](https://console.neon.tech) にアクセス
2. GitHubアカウントでサインアップ（推奨）またはメールアドレスで登録

## 2. プロジェクトとデータベースの作成

1. Neon Consoleで「Create Project」をクリック
2. プロジェクト名を入力（例: `taskflow-agent`）
3. リージョンを選択（例: `US East (Ohio)`）
4. PostgreSQLバージョンを選択（最新版を推奨）
5. 「Create Project」をクリック

## 3. 接続文字列の取得

1. プロジェクトダッシュボードで「Connection Details」を開く
2. 「Connection string」セクションから接続文字列をコピー
   - 形式: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`
   - 例: `postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

## 4. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成：

```bash
# .envファイルを作成
touch .env
```

`.env` ファイルを開き、以下の内容を追加（Neonの接続文字列に置き換え）：

```env
# Database (Neon PostgreSQL)
# Neon Consoleから取得した接続文字列
DATABASE_URL="postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
# 生成コマンド: openssl rand -base64 32

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"
OPENAI_ORG_ID="org-your-org-id"

# App
APP_URL="http://localhost:3000"
```

### 接続プーリング（オプション・推奨）

Neonは接続プーリングを提供しています。本番環境や高トラフィック環境では、接続プーリングエンドポイントを使用することを推奨します：

1. Neon Consoleで「Connection Details」を開く
2. 「Pooled connection」タブを選択
3. 接続文字列をコピー（`-pooler` が含まれます）

```env
# 接続プーリング使用時
DATABASE_URL="postgresql://user:password@ep-xxxxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

**注意**: 接続プーリングは通常の接続文字列とは異なるエンドポイントを使用します。

## 5. データベーススキーマの適用

```bash
# Prismaクライアントを生成
npm run db:generate

# データベースにスキーマを適用
npm run db:push
```

または、マイグレーションを使用する場合：

```bash
# 初回マイグレーション
npm run db:migrate

# マイグレーション名を入力（例: init）
```

## 6. 接続確認

Prisma Studioでデータベースを確認：

```bash
npm run db:studio
```

ブラウザで `http://localhost:5555` が開き、データベースの内容を確認できます。

## トラブルシューティング

### 接続エラーが発生する場合

1. **SSL接続の確認**: 接続文字列に `?sslmode=require` が含まれているか確認
2. **ファイアウォール**: Neonはデフォルトで全IPアドレスからの接続を許可しています
3. **接続文字列の形式**: パスワードに特殊文字が含まれる場合はURLエンコードが必要な場合があります

### パスワードをリセットする場合

1. Neon Consoleでプロジェクトを開く
2. 「Settings」→「Connection Details」
3. 「Reset Password」をクリック
4. 新しいパスワードをコピーして接続文字列を更新

## Neonの特徴

- **サーバーレス**: 自動スケーリング、使用量に応じた課金
- **ブランチ機能**: 開発用のデータベースブランチを作成可能
- **無料プラン**: 月間10時間のアクティブ時間、3GBストレージ
- **高速**: グローバルCDNによる低レイテンシー

## 本番環境での設定

本番環境（Vercel等）では、環境変数として `DATABASE_URL` を設定してください。

Vercelの場合：
1. プロジェクト設定 → Environment Variables
2. `DATABASE_URL` を追加
3. Neonの接続文字列をペースト

## 参考リンク

- [Neon Documentation](https://neon.tech/docs)
- [Prisma with Neon](https://neon.tech/docs/guides/prisma)
- [Connection Pooling](https://neon.tech/docs/connect/connection-pooling)


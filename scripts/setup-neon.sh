#!/bin/bash

# Neon データベースセットアップスクリプト

echo "🚀 TaskFlow Agent - Neon データベースセットアップ"
echo ""

# .envファイルの存在確認
if [ ! -f .env ]; then
    echo "📝 .envファイルが見つかりません。作成します..."
    cat > .env << EOF
# Database (Neon PostgreSQL)
# Neon Console (https://console.neon.tech) から接続文字列を取得して貼り付けてください
DATABASE_URL="postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""
# シークレット生成コマンド: openssl rand -base64 32

# OpenAI
OPENAI_API_KEY=""
OPENAI_ORG_ID=""

# App
APP_URL="http://localhost:3000"
APP_ENV="development"
EOF
    echo "✅ .envファイルを作成しました"
    echo ""
    echo "⚠️  次に以下を実行してください:"
    echo "   1. Neon Console (https://console.neon.tech) でデータベースを作成"
    echo "   2. 接続文字列をコピーして .env の DATABASE_URL に貼り付け"
    echo "   3. NEXTAUTH_SECRET を生成: openssl rand -base64 32"
    echo "   4. OpenAI APIキーを設定"
    echo ""
    exit 0
fi

# DATABASE_URLの確認
if grep -q "ep-.*\.neon\.tech" .env; then
    echo "✅ DATABASE_URLが設定されています"
else
    echo "⚠️  DATABASE_URLがNeonの接続文字列になっていません"
    echo "   Neon Consoleから接続文字列を取得して .env に設定してください"
    exit 1
fi

# NEXTAUTH_SECRETの確認
if grep -q 'NEXTAUTH_SECRET=""' .env || ! grep -q "NEXTAUTH_SECRET=" .env; then
    echo "⚠️  NEXTAUTH_SECRETが設定されていません"
    echo "   生成中..."
    SECRET=$(openssl rand -base64 32)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|NEXTAUTH_SECRET=\"\"|NEXTAUTH_SECRET=\"$SECRET\"|" .env
    else
        # Linux
        sed -i "s|NEXTAUTH_SECRET=\"\"|NEXTAUTH_SECRET=\"$SECRET\"|" .env
    fi
    echo "✅ NEXTAUTH_SECRETを生成しました"
fi

echo ""
echo "📦 Prismaクライアントを生成中..."
npm run db:generate

echo ""
echo "🗄️  データベースにスキーマを適用中..."
npm run db:push

echo ""
echo "✅ セットアップが完了しました！"
echo ""
echo "次のステップ:"
echo "  1. npm run dev で開発サーバーを起動"
echo "  2. npm run db:studio でデータベースを確認（オプション）"
echo ""


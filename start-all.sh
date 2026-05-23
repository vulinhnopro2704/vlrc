#!/bin/zsh

# Create logs directory inside the FE workspace for easy access
LOGS_DIR="/Users/mgmadmin/personal/vlrc/logs"
mkdir -p "$LOGS_DIR"

echo "=== STARTING ALL SERVICES ==="
echo "Logs will be written to: $LOGS_DIR"
echo ""

# 1. Start Redis check
echo "Checking Redis container..."
if docker ps | grep -q "redis"; then
  echo "✅ Redis container is already running."
else
  echo "⚠️ Redis is not running! Starting redis via Docker..."
  docker run -d --name redis -p 6379:6379 redis:latest
fi

# 2. Start Python FSRS-AI service
echo "Starting FSRS-AI service (FastAPI on Port 3004)..."
(
  cd /Users/mgmadmin/personal/english-learning-be/fsrs-ai
  source .venv/bin/activate
  uvicorn app.main:app --host 127.0.0.1 --port 3004 > "$LOGS_DIR/fsrs-ai.log" 2>&1
) &
echo "🚀 FSRS-AI started in background."

# 3. Start NestJS Microservices
echo "Starting Auth Service (NestJS on Port 3001)..."
(
  cd /Users/mgmadmin/personal/english-learning-be/auth
  pnpm start:dev > "$LOGS_DIR/auth.log" 2>&1
) &
echo "🚀 Auth Service started in background."

echo "Starting Learn Service (NestJS on Port 3002)..."
(
  cd /Users/mgmadmin/personal/english-learning-be/learn
  pnpm start:dev > "$LOGS_DIR/learn.log" 2>&1
) &
echo "🚀 Learn Service started in background."

echo "Starting Storage Service (NestJS on Port 3003)..."
(
  cd /Users/mgmadmin/personal/english-learning-be/storage
  pnpm start:dev > "$LOGS_DIR/storage.log" 2>&1
) &
echo "🚀 Storage Service started in background."

echo "Starting Generative Service (NestJS on Port 3005)..."
(
  cd /Users/mgmadmin/personal/english-learning-be/generative
  pnpm start:dev > "$LOGS_DIR/generative.log" 2>&1
) &
echo "🚀 Generative Service started in background."

# Wait a few seconds for database / ports of microservices to bind before starting the gateway
echo "Waiting 5 seconds for microservices to bind ports..."
sleep 5

# 4. Start API Gateway
echo "Starting API Gateway (NestJS on Port 3000)..."
(
  cd /Users/mgmadmin/personal/english-learning-be/gateway
  pnpm start:dev > "$LOGS_DIR/gateway.log" 2>&1
) &
echo "🚀 API Gateway started in background."

# 5. Start Frontend dev server
echo "Starting Frontend Development Server (Vite on Port 5173)..."
(
  cd /Users/mgmadmin/personal/vlrc
  pnpm dev > "$LOGS_DIR/frontend.log" 2>&1
) &
echo "🚀 Frontend started in background."

echo ""
echo "=== ALL SERVICES LAUNCHED SUCCESSFULLY ==="
echo "Ports mapping:"
echo "  - Frontend:       http://localhost:5173"
echo "  - API Gateway:    http://localhost:3000"
echo "  - Auth Service:   http://localhost:3001"
echo "  - Learn Service:  http://localhost:3002"
echo "  - Storage Service:http://localhost:3003"
echo "  - FSRS-AI (Py):   http://localhost:3004"
echo "  - Generative AI:  http://localhost:3005"
echo ""
echo "You can view logs directly in VS Code inside the './logs/' folder."
echo "To terminate all background services later, run: killall node python3 uvicorn"

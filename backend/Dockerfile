# Stage 1: Build Lobster Trap from source
FROM golang:1.22-bookworm AS lobster-builder

RUN apt-get update && apt-get install -y git make
RUN git clone https://github.com/veeainc/lobstertrap.git /lobstertrap
WORKDIR /lobstertrap
RUN CGO_ENABLED=0 GOOS=linux go build -o lobstertrap .

# Stage 2: Python backend + Lobster Trap binary
FROM python:3.11-slim

WORKDIR /app

# Install supervisor to run both processes
RUN pip install --no-cache-dir supervisor

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Copy Lobster Trap binary from builder
COPY --from=lobster-builder /lobstertrap/lobstertrap /app/lobstertrap
RUN chmod +x /app/lobstertrap

# Seed demo data
RUN python seed_demo.py --clear || true

# Supervisor config to run both Lobster Trap and FastAPI
RUN cat > /etc/supervisord.conf <<'EOF'
[supervisord]
nodaemon=true
logfile=/dev/stdout
logfile_maxbytes=0

[program:lobstertrap]
command=/app/lobstertrap serve --policy /app/configs/agentguard_policy.yaml --backend https://generativelanguage.googleapis.com/v1beta/openai --listen :8080
directory=/app
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:fastapi]
command=bash -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
directory=/app
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
EOF

EXPOSE 8000

CMD ["supervisord", "-c", "/etc/supervisord.conf"]

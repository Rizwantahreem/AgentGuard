$proc = Start-Process -FilePath "C:\Users\tehreem.rizwan\Desktop\pet-p\lobstertrap\lobstertrap.exe" `
    -ArgumentList @(
        "serve",
        "--policy", "C:\Users\tehreem.rizwan\Desktop\pet-p\observibility\backend\configs\agentguard_policy.yaml",
        "--backend", "https://generativelanguage.googleapis.com/v1beta/openai",
        "--listen", ":8080",
        "--audit-log", "C:\Users\tehreem.rizwan\Desktop\pet-p\observibility\backend\lobstertrap_audit.jsonl"
    ) `
    -PassThru

Write-Host "PID: $($proc.Id)"

$proc = Start-Process -FilePath "C:\Users\tehreem.rizwan\Desktop\pet-p\observibility\backend\lobstertrap.exe" `
    -ArgumentList "serve","--policy","C:\Users\tehreem.rizwan\Desktop\pet-p\observibility\backend\configs\agentguard_policy.yaml","--backend","https://generativelanguage.googleapis.com/v1beta/openai","--listen",":8080","--audit-log","C:\Users\tehreem.rizwan\Desktop\pet-p\observibility\backend\lobstertrap_audit.jsonl" `
    -PassThru `
    -WindowStyle Hidden

Write-Host "Lobster Trap started with PID: $($proc.Id)"
Start-Sleep 3
$tcp = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($tcp) {
    Write-Host "Lobster Trap is listening on port 8080"
} else {
    Write-Host "WARNING: Port 8080 not listening. Process alive: $(!$proc.HasExited)"
    if ($proc.HasExited) {
        Write-Host "Exit code: $($proc.ExitCode)"
    }
}

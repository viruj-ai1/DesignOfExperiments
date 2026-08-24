# start_backend.ps1  –  Launch the FastAPI backend
Write-Host ""
Write-Host "  ╔═══════════════════════════════════════════╗"
Write-Host "  ║   DOE Workflow Studio – Backend Server    ║"
Write-Host "  ╚═══════════════════════════════════════════╝"
Write-Host ""
Write-Host "  Starting FastAPI on http://localhost:8000"
Write-Host "  API docs: http://localhost:8000/docs"
Write-Host ""

$python = 'C:\Users\mahat\anaconda3\python.exe'
Set-Location -Path .\backend
& $python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload

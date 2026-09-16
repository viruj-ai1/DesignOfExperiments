# start_frontend.ps1  –  Launch the React dev server
Write-Host ""
Write-Host "  ╔═══════════════════════════════════════════╗"
Write-Host "  ║   DOE Workflow Studio – Frontend          ║"
Write-Host "  ╚═══════════════════════════════════════════╝"
Write-Host ""
Write-Host "  Starting Vite dev server on http://localhost:5173"
Write-Host "  Make sure backend is running on port 8000"
Write-Host ""

Set-Location "d:\Viruj Pharma\DOE-1\frontend"
npm run dev

# Start both the backend and frontend in separate windows

Write-Host "Starting DOE-1 Backend and Frontend..."

# Start backend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit -File .\start_backend.ps1" -WindowStyle Normal

# Start frontend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit -File .\start_frontend.ps1" -WindowStyle Normal

Write-Host "Both services are starting up!"

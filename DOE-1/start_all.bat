@echo off
echo Starting DOE-1 Backend and Frontend...

start cmd /k "powershell -ExecutionPolicy Bypass -File .\start_backend.ps1"
start cmd /k "powershell -ExecutionPolicy Bypass -File .\start_frontend.ps1"

echo Both services are starting up!

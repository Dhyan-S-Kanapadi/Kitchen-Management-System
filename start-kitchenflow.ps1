$ErrorActionPreference = "Continue"

Set-Location "D:\Kitchen management system(os)\KitchenFlowOS"

function Stop-PortProcess {
  param([int]$Port)

  $lines = netstat -ano | Select-String ":$Port\s"
  $pids = @()
  foreach ($line in $lines) {
    $parts = ($line.ToString() -split "\s+") | Where-Object { $_ -ne "" }
    if ($parts.Length -ge 5 -and $parts[-2] -eq "LISTENING") {
      $pids += [int]$parts[-1]
    }
  }

  $pids = $pids | Sort-Object -Unique
  foreach ($processId in $pids) {
    Write-Host "Stopping process $processId on port $Port"
    taskkill /PID $processId /F | Out-Null
  }
}

Write-Host "Stopping old KitchenFlow OS servers..."
Stop-PortProcess 5000
Stop-PortProcess 5173
Start-Sleep -Seconds 1

Write-Host "Starting backend on http://localhost:5000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\Kitchen management system(os)\KitchenFlowOS\backend'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "Starting frontend on http://localhost:5173"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\Kitchen management system(os)\KitchenFlowOS\frontend'; npm run dev"

Write-Host ""
Write-Host "Open the app at: http://localhost:5173"

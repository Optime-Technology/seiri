# Seiri kurulumu: eski veriler silinmez; yalnızca bilinen kısayollar taşınır.
$ErrorActionPreference = 'Stop'
$source = $PSScriptRoot
$target = Join-Path $env:LOCALAPPDATA 'Programs\Seiri'
$oldFocus = Join-Path $env:LOCALAPPDATA 'Programs\FocusFlow\FocusFlow.exe'
$oldZaman = Join-Path $env:LOCALAPPDATA 'Programs\Zaman\Zaman.exe'
$running = Get-Process -Name Seiri,FocusFlow,Zaman -ErrorAction SilentlyContinue
if ($running) { throw 'Seiri veya eski surum acik. Sistem tepsisinden Cikis secip yeniden deneyin.' }
# Yeni dosyalar ayrı bir dizinde hazırlanır; kopyalama hatası çalışan kurulumu bozmaz.
if ([IO.Path]::GetFullPath($source).TrimEnd('\') -ne [IO.Path]::GetFullPath($target).TrimEnd('\')) {
 $installParent = Split-Path -Parent $target
 New-Item -ItemType Directory -Path $installParent -Force | Out-Null
 $installStage = Join-Path $installParent ('Seiri.update-' + [Guid]::NewGuid().ToString('N'))
 $oldInstall = Join-Path $installParent 'Seiri.previous'
 try {
  New-Item -ItemType Directory -Path $installStage -Force | Out-Null
  Get-ChildItem -LiteralPath $source | Copy-Item -Destination $installStage -Recurse -Force
  $stagedExe = Join-Path $installStage 'Seiri.exe'
  $report = Get-Content -LiteralPath (Join-Path $installStage 'DOGRULAMA.json') -Raw | ConvertFrom-Json
  if ((Get-FileHash -LiteralPath $stagedExe -Algorithm SHA256).Hash.ToLowerInvariant() -ne $report.custom_executable_sha256) { throw 'Uygulama dosyasi dogrulanamadi. ZIP dosyasini yeniden indirin.' }
  if (Test-Path -LiteralPath $oldInstall) { Remove-Item -LiteralPath $oldInstall -Recurse -Force }
  if (Test-Path -LiteralPath $target) { Move-Item -LiteralPath $target -Destination $oldInstall }
  try { Move-Item -LiteralPath $installStage -Destination $target }
  catch {
   if ((Test-Path -LiteralPath $oldInstall) -and !(Test-Path -LiteralPath $target)) { Move-Item -LiteralPath $oldInstall -Destination $target }
   throw
  }
 } finally { if (Test-Path -LiteralPath $installStage) { Remove-Item -LiteralPath $installStage -Recurse -Force } }
}
$exe = Join-Path $target 'Seiri.exe'
$ws = New-Object -ComObject WScript.Shell
$desktop = [Environment]::GetFolderPath('Desktop')
$startMenu = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs'
foreach ($directory in @($desktop, $startMenu)) {
 $link = $ws.CreateShortcut((Join-Path $directory 'Seiri.lnk'))
 $link.TargetPath = $exe
 $link.WorkingDirectory = $target
 $link.IconLocation = (Join-Path $target 'resources\app\desktop\icon.ico') + ',0'
 $link.Description = 'Seiri - Optime Technology'
 $link.Save()
 foreach ($legacy in @(@{Name='FocusFlow';Path=$oldFocus},@{Name='Zaman';Path=$oldZaman})) {
  $oldLink = Join-Path $directory ($legacy.Name + '.lnk')
  if (Test-Path -LiteralPath $oldLink) {
   $oldShortcut = $ws.CreateShortcut($oldLink)
   if ($oldShortcut.TargetPath -eq $legacy.Path) { Remove-Item -LiteralPath $oldLink -Force }
  }
 }
}
$runPath = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run'
foreach ($legacy in @(@{Name='FocusFlow';Path=$oldFocus},@{Name='Zaman';Path=$oldZaman})) {
 $runValue = (Get-ItemProperty -LiteralPath $runPath -Name $legacy.Name -ErrorAction SilentlyContinue).($legacy.Name)
 if ($runValue -and $runValue.Trim('"') -eq $legacy.Path) {
  New-ItemProperty -LiteralPath $runPath -Name Seiri -Value ('"' + $exe + '"') -PropertyType String -Force | Out-Null
  Remove-ItemProperty -LiteralPath $runPath -Name $legacy.Name -ErrorAction SilentlyContinue
 }
}
Start-Process -FilePath $exe -WorkingDirectory $target
Write-Host 'Seiri kuruldu. Optime Technology. Eski notlariniz ve ayarlariniz korunur.'

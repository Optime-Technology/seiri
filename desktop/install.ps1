# Seiri kurulumu: eski veriler silinmez; yalnızca bilinen kısayollar taşınır.
$ErrorActionPreference = 'Stop'
$source = $PSScriptRoot
$target = Join-Path $env:LOCALAPPDATA 'Programs\Seiri'
$oldFocus = Join-Path $env:LOCALAPPDATA 'Programs\FocusFlow\FocusFlow.exe'
$oldZaman = Join-Path $env:LOCALAPPDATA 'Programs\Zaman\Zaman.exe'
$running = Get-Process -Name Seiri,FocusFlow,Zaman -ErrorAction SilentlyContinue
if ($running) { throw 'Seiri veya eski surum acik. Sistem tepsisinden Cikis secip yeniden deneyin.' }
if ([IO.Path]::GetFullPath($source).TrimEnd('\') -ne [IO.Path]::GetFullPath($target).TrimEnd('\')) {
 New-Item -ItemType Directory -Path $target -Force | Out-Null
 Get-ChildItem -LiteralPath $source | Copy-Item -Destination $target -Recurse -Force
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

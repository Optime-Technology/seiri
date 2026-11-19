# Paket bütünlüğü ön kontrolü; görsel/Hello/bildirim kabulünün yerine geçmez.
param([string]$PackageDirectory=$PSScriptRoot)
$ErrorActionPreference='Stop'
$report=[ordered]@{checkedAt=(Get-Date).ToUniversalTime().ToString('o');os=[Environment]::OSVersion.VersionString;packageIntegrity=$false;signature='unknown';temporaryWrite=$false;physicalUIAcceptance=$false}
try {
 $base=(Resolve-Path -LiteralPath $PackageDirectory).Path
 $checks=Get-Content -LiteralPath (Join-Path $base 'DOGRULAMA.json') -Raw | ConvertFrom-Json
 $exe=Join-Path $base 'Seiri.exe'
 if ((Get-FileHash -LiteralPath $exe -Algorithm SHA256).Hash.ToLowerInvariant() -ne $checks.custom_executable_sha256) { throw 'EXE ozeti paket raporuyla eslesmiyor.' }
 foreach ($relative in @('resources\app\package.json','resources\app\app\index.html','resources\app\desktop\preload.cjs','resources.pak','icudtl.dat','libEGL.dll','libGLESv2.dll')) {
  if (!(Test-Path -LiteralPath (Join-Path $base $relative))) { throw ('Eksik dosya: '+$relative) }
 }
 $report.version=(Get-Content -LiteralPath (Join-Path $base 'resources\app\package.json') -Raw | ConvertFrom-Json).version
 $report.packageIntegrity=$true
 $report.signature=(Get-AuthenticodeSignature -LiteralPath $exe).Status.ToString()
 $probe=Join-Path ([IO.Path]::GetTempPath()) ('seiri-check-'+[Guid]::NewGuid().ToString('N'))
 try { [IO.File]::WriteAllText($probe,'Seiri');$report.temporaryWrite=([IO.File]::ReadAllText($probe) -eq 'Seiri') } finally { if(Test-Path -LiteralPath $probe){Remove-Item -LiteralPath $probe} }
 $report.note='Bu yalnizca paket on kontroludur. Not yazma, ekran olcegi, bildirim, ses ve Windows Hello elle denenmelidir.'
} catch { $report.error=$_.Exception.Message }
$destination=Join-Path ([IO.Path]::GetTempPath()) ('Seiri-Windows-Kontrol-'+(Get-Date -Format 'yyyyMMdd-HHmmss')+'.json')
$report | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $destination -Encoding UTF8
Write-Host ('Kontrol raporu: '+$destination)
if (!$report.packageIntegrity -or !$report.temporaryWrite) { throw 'Paket on kontrolu basarisiz.' }
Write-Host ('Imza durumu: '+$report.signature)
Write-Host 'Paket on kontrolu tamamlandi; fiziksel uygulama kabulu tamamlanmis sayilmaz.'

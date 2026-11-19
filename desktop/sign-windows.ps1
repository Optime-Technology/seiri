# İsteğe bağlı Authenticode imzası. Sertifika ve parola yalnızca ortam/CI Secrets üzerinden gelir.
param([Parameter(Mandatory=$true)][string]$Executable)
$ErrorActionPreference = 'Stop'
if (!$env:SEIRI_SIGN_PFX_BASE64 -or !$env:SEIRI_SIGN_PASSWORD) { throw 'Imza sertifikasi ve parolasi ayarlanmadi.' }
$signTool = Get-ChildItem -Path "${env:ProgramFiles(x86)}\Windows Kits\10\bin\*\x64\signtool.exe" -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -First 1
if (!$signTool) { throw 'Windows SDK signtool.exe bulunamadi.' }
$certFile = Join-Path ([IO.Path]::GetTempPath()) ('seiri-sign-' + [Guid]::NewGuid().ToString('N') + '.pfx')
try {
 [IO.File]::WriteAllBytes($certFile,[Convert]::FromBase64String($env:SEIRI_SIGN_PFX_BASE64))
 & $signTool.FullName sign /fd SHA256 /f $certFile /p $env:SEIRI_SIGN_PASSWORD $Executable
 if ($LASTEXITCODE -ne 0) { throw 'Imzalama basarisiz.' }
 $signature = Get-AuthenticodeSignature -LiteralPath $Executable
 if ($signature.Status -ne 'Valid') { throw 'Imza guven zinciri dogrulanamadi. Paket yayimlanmadi.' }
} finally { if (Test-Path -LiteralPath $certFile) { Remove-Item -LiteralPath $certFile -Force } }

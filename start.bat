@echo off

pushd "C:\node\namecollect"

start "namecollect" "%SystemRoot%\system32\WindowsPowerShell\v1.0\powershell.exe" "node src\app.js 3000"

exit
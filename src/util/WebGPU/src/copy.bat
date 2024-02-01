@echo off
del ..\*.js
for /d /r %%i in (*) do copy /y "%%i\*.js" "%~dp0\.."
for %%i in (..\*.js) do echo '%%i',
copy /y WebGpu.js "%~dp0\.."
for /f "delims=" %%i in ('dir /b ..\*.js') do  (
  for /f "tokens=2 delims= " %%j in ("%%i") do ren "..\%%i" "%%j"
)
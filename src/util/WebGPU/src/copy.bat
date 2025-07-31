@echo off
setlocal enabledelayedexpansion
del ..\*.js
for /d /r %%i in (*) do copy /y "%%i\*.js" "%~dp0\.."
set str=
for /f "delims=" %%i in ('dir /b ..\*.js') do (
echo '%%i',
  set "str=!str!%%i,"
)
node sort.js "!str!"
copy /y WebGpu.js "%~dp0\.."
copy /y WGSL.js "%~dp0\.."
for /f "delims=" %%i in ('dir /b ..\*.js') do  (
  for /f "tokens=2 delims= " %%j in ("%%i") do ren "..\%%i" "%%j"
)
@echo off
for /f "delims=" %%i in ('dir /b *.js') do del "%%i"
FOR %%A IN ("%~dp0.") DO set dst %%~dpA
echo dst 
for /d /r %%i in (*) do copy /y "%%i\*.js" dst
::cd %~dp0
for %%i in (*.js) do echo '%%i',
copy /y .\src\WebGpu.js %~dp0
::for /f "delims=" %%i in ('dir /b *.js') do  echo %%i,
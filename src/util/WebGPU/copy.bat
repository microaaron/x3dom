@echo off
for %%i in (GPU*.js) do del "%%i",
for /d /r %%i in (*) do copy /y %%i\*.js %~dp0
for %%i in (GPU*.js) do echo "%%i",
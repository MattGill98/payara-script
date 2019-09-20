@ECHO OFF

:: Helper script to call the Payara Utility Tool
::
:: Author: Matt Gill

set SCRIPT_DIR=%~dp0

java -cp "%SCRIPT_DIR%target\classes\;%SCRIPT_DIR%target\lib\*" uk.me.mattgill.payara.tools.Main %*

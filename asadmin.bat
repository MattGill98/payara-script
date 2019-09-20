@ECHO OFF

:: Helper script to call asadmin
::
:: Author: Matt Gill

set SCRIPT_DIR=%~dp0

%SCRIPT_DIR%payara asadmin %*

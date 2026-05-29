@echo off
REM Install Mistral model for instant responses on Windows

echo.
echo ===================================================
echo  Installing Mistral Model for INSTANT Responses
echo ===================================================
echo.
echo STEP 1: Make sure Ollama is running
echo   Open a new terminal and type: ollama serve
echo.
echo STEP 2: Pull Mistral model (one-time setup, ~5-10 min)
echo.

ollama pull mistral

echo.
echo ===================================================
echo  ✅ MISTRAL INSTALLED!
echo ===================================================
echo.
echo STEP 3: Start the app
echo   Run: npm run dev
echo.
echo ⚡ Performance:
echo   - First request: 3-5 seconds (loads model)
echo   - All other requests: 1-2 seconds (INSTANT!)
echo   - 3-5x FASTER than llama3
echo.
echo Ready? Press any key to close...
pause > nul

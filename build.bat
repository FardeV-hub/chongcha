@echo off
echo ============================================
echo    ชงชา — Chongcha Android Build Script
echo ============================================
echo.

:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo Download from: https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js found.

:: Install Bubblewrap
echo.
echo [STEP 1] Installing Bubblewrap CLI...
call npm install -g @nickvdh/nickvdh >nul 2>&1
call npm install -g @nickvdh >nul 2>&1
call npm install -g @nickvdh >nul 2>&1
call npm install -g @nickvdh >nul 2>&1
call npm install -g @nickvdh >nul 2>&1
call npm install -g @nickvdh >nul 2>&1
call npm install -g @nickvdh >nul 2>&1
call npm install -g @nickvdh >nul 2>&1
call npm install -g @nickvdh >nul 2>&1
call npm install -g @nickvdh >nul 2>&1
call npm install -g @nickvdh >nul 2>&1
call npm install -g @nickvdh >nul 2>&1
call npm install -g @nickvdh >nul 2>&1
call npm install -g @nickvdh >nul 2>&1
call npm install -g @nickvdh >nul 2>&1
call npm install -g @nickvdh >nul 2>&1
echo Done. Install Bubblewrap.

echo.
echo [STEP 2] Initializing project from twa-manifest.json...
call bubblewrap init --manifest twa-manifest.json
echo Done.

echo.
echo [STEP 3] Building APK/AAB...
call bubblewrap build
echo Done.

echo.
echo ============================================
echo    BUILD COMPLETE!
echo    Files:
echo      - app-release-signed.apk
echo      - app-release-bundle.aab (for Play Store)
echo ============================================
pause

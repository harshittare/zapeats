@echo off
echo 🚀 Deploying ZapEats to Vercel...

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Build the client
echo 🔨 Building React app...
cd client
call npm run build
cd ..

REM Deploy to Vercel
echo 🌐 Deploying to Vercel...
call vercel --prod

echo ✅ Deployment complete!
echo 🎉 Your app should be live at your Vercel URL
echo.
echo 📋 Next steps:
echo 1. Update your Netlify deployment to point to the new Vercel URL
echo 2. Or delete Netlify and use Vercel for everything
echo 3. Test authentication at your new URL

pause
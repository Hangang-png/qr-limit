@echo off
title GitHub 一键推送 - qr-limit

cd /d D:\student\qr-limit

echo =============================
echo   正在添加所有修改...
echo =============================
git add .

echo =============================
echo   正在提交...
echo =============================
set /p msg=请输入提交说明（默认: 更新）： 
if "%msg%"=="" set msg=更新
git commit -m "%msg%"

echo =============================
echo   正在推送到 GitHub...
echo =============================
git push origin main

echo =============================
echo   推送完成！
echo =============================
pause

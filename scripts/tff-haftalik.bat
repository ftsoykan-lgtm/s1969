@echo off
REM ============================================================
REM  Sanliurfaspor - TFF Verisi Haftalik Guncelleme
REM  Windows Zamanlanmis Gorev (Task Scheduler) ile calistirilir.
REM  Veriyi ceker + Supabase'e yazar (.env.local'daki anahtarlarla).
REM ============================================================

REM Proje koku (bu bat dosyasinin bir ust klasoru)
cd /d "%~dp0.."

echo [%date% %time%] TFF guncelleme basladi >> "%~dp0tff-log.txt"
call npm run tff >> "%~dp0tff-log.txt" 2>&1
echo [%date% %time%] TFF guncelleme bitti >> "%~dp0tff-log.txt"
echo. >> "%~dp0tff-log.txt"

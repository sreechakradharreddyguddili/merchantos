cd C:\MerchantOS\ai-service
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000

cd backend
npm run dev

cd frontend
npm run dev
import uvicorn        # Uvicorn is the server used to run FastAPI apps
from main import app  # Import the app instance from main.py

if __name__ == '__main__':
    uvicorn.run(app=app, port=3001, host="0.0.0.0")
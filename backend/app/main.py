from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Smart Budgeting App API")

# Allow the frontend (running on a different port/domain) to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to Ndivhuwo's actual frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Smart Budgeting App API is running"}
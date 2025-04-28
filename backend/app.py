from fastapi import FastAPI
from .routers import discordrouter,messagerouter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(discordrouter)
app.include_router(messagerouter)

origins = [
    "http://127.0.0.1:8000",
    # "http://githubsite.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
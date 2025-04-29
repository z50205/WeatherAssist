from fastapi import FastAPI
from .routers import discordrouter,emailrouter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(discordrouter)
app.include_router(emailrouter)

origins = [
    "http://127.0.0.1:8000",
    "http://127.0.0.1:5500",
    "https://z50205.github.io"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
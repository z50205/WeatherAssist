# 請芝萍協作Discord推播的API
from fastapi import APIRouter,status,Request
from fastapi.responses import JSONResponse

discordrouter = APIRouter()



@discordrouter.get("/")
async def root(request: Request):
    return JSONResponse(status_code=status.HTTP_200_OK,content={"Hello":"true"})
from fastapi import APIRouter,status,Request
from fastapi.responses import JSONResponse

messagerouter = APIRouter()

@messagerouter.get("/message")
async def root(request: Request):
    return JSONResponse(status_code=status.HTTP_200_OK,content={"Hello":"true"})
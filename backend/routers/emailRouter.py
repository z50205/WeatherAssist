from fastapi import APIRouter,status,Request,Form
from fastapi.responses import JSONResponse,FileResponse

from pydantic import EmailStr
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from dotenv import load_dotenv
import os,uuid
from jinja2 import Template

emailrouter = APIRouter()

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME =os.environ.get("MAIL_USERNAME","admin"),
    MAIL_PASSWORD =os.environ.get("MAIL_PASSWORD","app key"),
    MAIL_FROM = os.environ.get("MAIL_FROM","sender email"),
    MAIL_FROM_NAME=os.environ.get("MAIL_FROM_NAME","project name"),
    MAIL_PORT = os.environ.get("MAIL_PORT",465),
    MAIL_SERVER = os.environ.get("MAIL_SERVER","server domain"),
    MAIL_STARTTLS = os.environ.get("MAIL_STARTTLS",False),
    MAIL_SSL_TLS = os.environ.get("MAIL_SSL_TLS",True),
    USE_CREDENTIALS = os.environ.get("USE_CREDENTIALS",True),
    VALIDATE_CERTS = os.environ.get("VALIDATE_CERTS",True)
)

template_path = os.path.join(os.path.dirname(__file__), "template.html")
with open(template_path, "r") as file:
    template_str = file.read()
jinja_template = Template(template_str)


@emailrouter.post("/api/email")
async def createMail(address: EmailStr=Form(...),image=Form(...)):
    print(address)
    try :
        if image:
            file_path = os.path.join(os.path.dirname(__file__), "emailImage")
            file_name = str(uuid.uuid4())+".png"
            with open(os.path.join(file_path,file_name), "wb") as f:
                f.write(image.file.read())
        email_content = jinja_template.render({"email":address,"image_id":file_name})
        message = MessageSchema(
            subject="Your Weather Tour",
            recipients=[address],
            body=email_content,
            subtype=MessageType.html)

        fm = FastMail(conf)
        await fm.send_message(message)
        return JSONResponse(status_code=status.HTTP_200_OK,content={"status":"send sucess"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=status.HTTP_200_OK,content={"status":"send Failed"})
    
@emailrouter.get("/api/email/{image_id}")
async def createMail(image_id: str):
    try :
        file_path = os.path.join(os.path.dirname(__file__), "emailImage")
        return FileResponse(os.path.join(file_path,image_id), media_type="image/*")
    except :
        return JSONResponse(status_code=status.HTTP_200_OK,content={"status":"send Failed"})

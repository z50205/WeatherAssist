from fastapi import APIRouter,status,Form
from fastapi.responses import JSONResponse,FileResponse
import os,httpx,json
from . import saveImage

discordrouter = APIRouter()
        
@discordrouter.post("/api/webhook")
async def post_weather(
  webhook=Form(default="https://discord.com/api/webhooks/1366080384927793243/X9l12ZV5rpuJfiTKhdzT4JDw9VlMkkluotj70-FmQh2xIG7QPmew8U1LtuOikecg00MY"),
  image=Form(...),
  departure=Form(...),
  destination=Form(...),
  ):
  departure_json = json.loads(departure)
  destination_json = json.loads(destination)
  try :
    if image:
      file_name=saveImage(image)
      BACKEND_IP = "https://bizara.link"
      image_url = f"{BACKEND_IP}/api/webhook/{file_name}"

      payload = {
            "username": "天氣旅程小助手",
            "embeds": [
              {
                "title": f"🚀   即將啟航的天氣旅程，去程：{departure_json['location']}   回程：{destination_json['location']}",
                "image": {
                  "url": image_url
                },
                "fields": [
                    {
                      "name": "🚅",
                      "value": departure_json['location'],
                      "inline": True
                    },
                    {
                      "name": "🚅",
                      "value": destination_json['location'],
                      "inline": True
                    },
                    {
                      "name": "\u200b",
                      "value": "\u200b",
                      "inline": True
                    },
                    {
                      "name": "🗓️",
                      "value": departure_json['choosedDate'],
                      "inline": True
                    },
                    {
                      "name": "🗓️",
                      "value": destination_json['choosedDate'],
                      "inline": True
                    },
                    {
                      "name": "\u200b",
                      "value": "\u200b",
                      "inline": True
                    },
                    {
                      "name": "🕗",
                      "value": departure_json['choosedTime'],
                      "inline": True
                    },
                    {
                      "name": "🕔",
                      "value": destination_json['choosedTime'],
                      "inline": True
                    },
                    {
                      "name": "\u200b",
                      "value": "\u200b",
                      "inline": True
                    },
                    {
                      "name": "🌥️",
                      "value": departure_json['weatherData'][0]['weather'],
                      "inline": True
                    },
                    {
                      "name": "🌥️",
                      "value": destination_json['weatherData'][0]['weather'],
                      "inline": True
                    },
                    {
                      "name": "\u200b",
                      "value": "\u200b",
                      "inline": True
                    },
                    {
                      "name": "🌟",
                      "value": f"目前 {departure_json['weatherData'][0]['temperature']}°C",
                      "inline": True
                    },
                    {
                      "name": "🌟",
                      "value": f"目前 {destination_json['weatherData'][0]['temperature']}°C",
                      "inline": True
                    },
                    {
                      "name": "\u200b",
                      "value": "\u200b",
                      "inline": True
                    },
                    {
                      "name": "📈",
                      "value": f"最高 {departure_json['weatherData'][0]['maxTemp']}°C",
                      "inline": True
                    },
                    {
                      "name": "📈",
                      "value": f"最高 {destination_json['weatherData'][0]['maxTemp']}°C",
                      "inline": True
                    },
                    {
                      "name": "\u200b",
                      "value": "\u200b",
                      "inline": True
                    },
                    {
                      "name": "📉",
                      "value": f"最低 {departure_json['weatherData'][0]['minTemp']}°C",
                      "inline": True
                    },
                    {
                      "name": "📉",
                      "value": f"最低 {destination_json['weatherData'][0]['minTemp']}°C",
                      "inline": True
                    },
                    {
                      "name": "\u200b",
                      "value": "\u200b",
                      "inline": True
                    },
                    {
                      "name": "🌧️",
                      "value": f"降雨 {departure_json['weatherData'][0]['chanceOfRain']}%",
                      "inline": True
                    },
                    {
                      "name": "🌧️",
                      "value": f"降雨 {destination_json['weatherData'][0]['chanceOfRain']}%",
                      "inline": True
                    },
                    {
                      "name": "\u200b",
                      "value": "\u200b",
                      "inline": True
                    }
                  ]
              }
            ]
          }       
      # 寄到 Discord webhook
      async with httpx.AsyncClient() as client:
        response = await client.post(webhook, json=payload)
        response.raise_for_status()
      return JSONResponse(status_code=status.HTTP_200_OK,content={"status":"send discord webhook Success"})
  except Exception as e:
    print(e)
    return JSONResponse(status_code=status.HTTP_200_OK,content={"status":"send discord webhook Failed"})


@discordrouter.get("/api/webhook/{image_id}")
async def createImage(image_id: str):
    try :
        file_path = os.path.join(os.path.dirname(__file__), "emailImage")
        return FileResponse(os.path.join(file_path,image_id), media_type="image/*")
    except :
        return JSONResponse(status_code=status.HTTP_200_OK,content={"status":"send Failed"})
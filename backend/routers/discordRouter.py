from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import List
from .emailRouter import emailrouter
import httpx

discordrouter = APIRouter()

class WeatherDetail(BaseModel):
    date: str
    time: str
    temperature: int
    chanceOfRain: int
    weather: str
    weatherCode: int
    maxTemp: int
    minTemp: int

class WeatherInfo(BaseModel):
    location: str
    choosedDate: str
    choosedTime: str
    weatherData: List[WeatherDetail]

class LocationWeather(BaseModel):
    webhook_url: str = 'https://discord.com/api/webhooks/1366354513677516821/h2KnELOg7TqDYLaYuVxumXv1HdOPKs-EHaH0NS1iMJbyGFwS5iw1YW1KT4u7rXM_BMyH'
    departure: WeatherInfo
    destination: WeatherInfo
    
    
@discordrouter.post("/api/webhook")
async def post_weather(request: Request, data: LocationWeather):
  result = await request.json()
  webhook_url = result['webhook_url']
  departure_data = result['departure']
  destination_data = result['destination']
  image_id = emailrouter.saveImage(image)
  
  backend_url = "https://your-backend-domain.com"
  image_url = f"{backend_url}/api/email/{image_id}"
  
  payload = {
    "username": "天氣旅程小助手",
    "embeds": [
      {
        "title": f"🚀   即將啟航的天氣旅程，去程：{departure_data['location']}   回程：{destination_data['location']}",
        "images": {
        "url": image_url
        },
        "fields": [
            {
              "name": "🚅",
              "value": departure_data['location'],
              "inline": True
            },
            {
              "name": "🚅",
              "value": destination_data['location'],
              "inline": True
            },
            {
              "name": "\u200b",  # 空白區塊占位，讓換行保持整齊
              "value": "\u200b",
              "inline": True
            },
            {
              "name": "🗓️",
              "value": departure_data['choosedDate'],
              "inline": True
            },
            {
              "name": "🗓️",
              "value": destination_data['choosedDate'],
              "inline": True
            },
            {
              "name": "\u200b",
              "value": "\u200b",
              "inline": True
            },
            {
              "name": "🕗",
              "value": departure_data['choosedTime'],
              "inline": True
            },
            {
              "name": "🕔",
              "value": destination_data['choosedTime'],
              "inline": True
            },
            {
              "name": "\u200b",
              "value": "\u200b",
              "inline": True
            },
            {
              "name": "🌥️",
              "value": departure_data['weatherData'][0]['weather'],
              "inline": True
            },
            {
              "name": "🌥️",
              "value": destination_data['weatherData'][0]['weather'],
              "inline": True
            },
            {
              "name": "\u200b",
              "value": "\u200b",
              "inline": True
            },
            {
              "name": "🌟",
              "value": f"目前 {departure_data['weatherData'][0]['temperature']}°C",
              "inline": True
            },
            {
              "name": "🌟",
              "value": f"目前 {destination_data['weatherData'][0]['temperature']}°C",
              "inline": True
            },
            {
              "name": "\u200b",
              "value": "\u200b",
              "inline": True
            },
            {
              "name": "📈",
              "value": f"最高 {departure_data['weatherData'][0]['maxTemp']}°C",
              "inline": True
            },
            {
              "name": "📈",
              "value": f"最高 {destination_data['weatherData'][0]['maxTemp']}°C",
              "inline": True
            },
            {
              "name": "\u200b",
              "value": "\u200b",
              "inline": True
            },
            {
              "name": "📉",
              "value": f"最低 {departure_data['weatherData'][0]['minTemp']}°C",
              "inline": True
            },
            {
              "name": "📉",
              "value": f"最低 {destination_data['weatherData'][0]['minTemp']}°C",
              "inline": True
            },
            {
              "name": "\u200b",
              "value": "\u200b",
              "inline": True
            },
            {
              "name": "🌧️",
              "value": f"降雨 {departure_data['weatherData'][0]['chanceOfRain']}%",
              "inline": True
            },
            {
              "name": "🌧️",
              "value": f"降雨 {destination_data['weatherData'][0]['chanceOfRain']}%",
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
    response = await client.post(webhook_url, json=payload)
    response.raise_for_status()
  return {"status": "ok"}
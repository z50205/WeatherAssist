// 請丹妮協作呼叫api
// Model
// const locationList = ['基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '臺東縣', '花蓮縣', '宜蘭縣' ,'澎湖縣' ,'金門縣', '連江縣']; // 若需要設定排序則使用此資料

let locationList = [];

const state = {
  allLocData: [],
  currentSpot: {
    location: "",
    choosedTime: "",
    weatherElement: [],
  },
  targetSpot: {
    location: "",
    choosedTime: "",
    weatherElement: [],
  },
};

// timeFrom參數必須是現在時刻的上一個計時點(00, 03, 06, 09, 12, 15, 18, 21)
// 如: 14:30->12:00, 15:01->15:00
// 但是!
// 每日 05:00 發佈的預報從 當日 06:00~18:00 開始
// 每日 11:00 發佈的預報從 當日 12:00~18:00 開始
// 每日 17:00 發佈的預報從 當日 18:00~06:00 開始
// 每日 23:00 發佈的預報從 隔日 00:00~06:00 開始
// 所以如果在11:01開啟程式，就已經沒有11:00的天氣可以看了。

const now = new Date();
const adjustedTime = new Date(now);
adjustedTime.setHours(Math.floor(now.getHours() / 3) * 3, 0, 0, 0);

const CWA_API_URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-093?Authorization=CWA-90BC9459-D42C-41C8-A3D0-287E64137A4A&locationId=F-D0047-089,F-D0047-091&timeFrom=${getDateStr(
  adjustedTime
)}`;

const getWeatherData = async function () {
  try {
    const respose = await fetch(
      CWA_API_URL + "&ElementName=3小時降雨機率,溫度,天氣現象,最高溫度,最低溫度"
    );
    const { records } = await respose.json();
    let data = [];
    for (let i = 0; i < records.Locations[0].Location.length; i++) {
      const weatherData = [
        ...records.Locations[0].Location[i].WeatherElement,
        findWEObj(records.Locations[1].Location[i].WeatherElement, "最高溫度"),
        findWEObj(records.Locations[1].Location[i].WeatherElement, "最低溫度"),
      ];
      const obj = {
        location: records.Locations[1].Location[i].LocationName,
        weatherData: weatherData,
      };
      data.push(obj);
    }

    data.forEach((locData) => {
      const normalizeLocData = normalizeWeatherData(locData.weatherData);
      locData.weatherData = normalizeLocData;
    });
    return data;
  } catch (err) {
    throw err;
  }
};

// View
const currSpotLocListView = {
  data: null,
  parentElement: null,
  render() {
    const data = this.data;
  },
};

const targetSpotLocListView = {
  data: null,
  parentElement: null,
  render() {
    const data = this.data;
  },
};

const currSpotDateView = {
  data: null,
  parentElement: null,
  render() {
    const data = this.data;
  },
};

const targetSpotDateView = {
  data: null,
  parentElement: null,
  render() {
    const data = this.data;
  },
};

const currSpotDetailView = {
  data: null,
  parentElement: null,
  render() {
    const data = this.data;
  },
};

const targetSpotDetailView = {
  data: null,
  parentElement: null,
  render() {
    const data = this.data;
  },
};

const currSpotTimeView = {
  data: null,
  parentElement: null,
  render() {
    const data = this.data;
  },
};

const targetSpotTimeView = {
  data: null,
  parentElement: null,
  render() {
    const data = this.data;
  },
};

// Controller
const controlUpdateData = async function () {
  try {
    const data = await getWeatherData();
    state.allLocData = data;
    console.log(state.allLocData);
  } catch (err) {
    console.error(err);
  }
};

const controlLocationList = async function () {};

const controlCurrSpot = async function (locationName) {
  const location = locationName || "臺北市"; // 預設顯示台北市的資料
  const renderData = state.allLocData.find((e) => e.location === location);
  console.log(renderData);
};

const controlTargetSpot = async function (locationName) {
  const location = locationName || "高雄市"; // 預設顯示高雄市的資料
  const renderData = state.allLocData.find((e) => e.location === location);
  console.log(renderData);
};

const init = async function () {
  await controlUpdateData();
  controlCurrSpot(state.currentSpot.location);
  controlTargetSpot(state.targetSpot.location);
};

init();

// Util
function getDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(
    2,
    "0"
  )}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function findWEObj(arr, elName) {
  const [targetObj] = arr.filter((obj) => obj.ElementName === elName);
  return targetObj;
}

function normalizeWeatherData(rawData) {
  const temperatureEntry = rawData.find((e) => e.ElementName === "溫度");
  const rainEntry = rawData.find((e) => e.ElementName === "3小時降雨機率");
  const weatherEntry = rawData.find((e) => e.ElementName === "天氣現象");
  const maxTempEntry = rawData.find((e) => e.ElementName === "最高溫度");
  const minTempEntry = rawData.find((e) => e.ElementName === "最低溫度");

  const output = temperatureEntry.Time.map((tempItem) => {
    const time = new Date(tempItem.DataTime);
    const dateStr = time.toISOString().slice(0, 10);
    const timeStr = time.toTimeString().slice(0, 8);
    const datetimeISO = time.toISOString();

    // 幫助函式：判斷某個時間是否在區段內
    const isInRange = (target, start, end) => {
      const t = new Date(target);
      return new Date(start) <= t && t < new Date(end);
    };

    // 找到符合這個時間的降雨資料
    const rainItem = rainEntry.Time.find((t) =>
      isInRange(time, t.StartTime, t.EndTime)
    );
    const weatherItem = weatherEntry.Time.find((t) =>
      isInRange(time, t.StartTime, t.EndTime)
    );
    const maxTempItem = maxTempEntry.Time.find((t) =>
      isInRange(time, t.StartTime, t.EndTime)
    );
    const minTempItem = minTempEntry.Time.find((t) =>
      isInRange(time, t.StartTime, t.EndTime)
    );

    return {
      date: dateStr,
      time: timeStr,
      temperature: tempItem.ElementValue[0].Temperature || null,
      chanceOfRain:
        rainItem?.ElementValue[0].ProbabilityOfPrecipitation || null,
      weather: weatherItem?.ElementValue[0].Weather || null,
      weatherCode: weatherItem?.ElementValue[0].WeatherCode || null,
      maxTemp: maxTempItem?.ElementValue[0].MaxTemperature || null,
      minTemp: minTempItem?.ElementValue[0].MinTemperature || null,
    };
  });

  return output;
}

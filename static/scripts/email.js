let BACKEND_IP="https://bizara.link";
const linkBtn=document.getElementsByClassName("attach-button")[0];
const emailBtn = document.getElementsByClassName("submit-btn")[1];
let shotImg=document.getElementById("screenShot")

// 只要點擊連結的link就會觸發截圖功能，並將截圖存在shotImg裡面
linkBtn.addEventListener("click",()=>{
    html2canvas(document.body).then(canvas => {
        shotImg.src = canvas.toDataURL("image/png");
    });
})
// 點擊Email發送按鈕就會傳資料予後端
emailBtn.addEventListener("click",async (event)=>{
    event.preventDefault();
    const emailInput = document.getElementsByClassName("email-input")[0];
    
    const email = emailInput.value;
    const res = await fetch(shotImg.src);
    const blob = await res.blob();

    const formData = new FormData();
    formData.append("image", blob, "screenshot.png");
    formData.append("address", email);
    formData.append("depature", state.currentSpot);
    formData.append("destination", state.targetSpot);
    let response=await fetch(BACKEND_IP+"/api/email",{
        method: "POST",
        body:formData
    })
    const result = await response.json();
    console.log(result);
})
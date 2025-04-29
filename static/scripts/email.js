let emailForm=document.getElementById("email");
let BACKEND_IP="http://13.112.29.121:8002";
emailForm.addEventListener("submit",async (event)=>{
    event.preventDefault();
    const form=new FormData(event.target);
    const email = document.getElementById("address").value;
    const img = document.getElementById("screenShotImg");
    const res = await fetch(img.src);
    const blob = await res.blob();

    const formData = new FormData();
    formData.append("image", blob, "screenshot.png");
    formData.append("address", email);


    let response=await fetch(BACKEND_IP+"/api/email",{
        method: "POST",
        body:formData
    })
    const result = await response.json();
    console.log(result);
})

let screenShotButton=document.getElementById("screenShot");
let screenShotImg=document.getElementById("screenShotImg");

screenShotButton.addEventListener("click",()=>{
    html2canvas(document.querySelector("#capture")).then(canvas => {
        screenShotImg.src = canvas.toDataURL("image/png");
    });
})

const dataURL = canvas.toDataURL();
console.log(dataURL);
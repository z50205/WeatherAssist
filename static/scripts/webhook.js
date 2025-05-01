let webhook_BACKEND_IP="https://bizara.link"
const webhook_hookBtns = document.getElementsByClassName("submit-btn");
const webhookBtn = webhook_hookBtns[0];
let webhook_shotImg=document.getElementById("screenShot")

webhookBtn.addEventListener("click",async (event)=>{
  event.preventDefault();

  const webhookInput = document.getElementsByClassName("webhook-input")[0];
  const webhookUrl = webhookInput.value;

  const res = await fetch(webhook_shotImg.src);
  const blob = await res.blob();

  const formData = new FormData();
  formData.append("image", blob, "screenshot.png");
  formData.append("webhook", webhookUrl);
  formData.append("departure", JSON.stringify(state.departure));
  formData.append("destination", JSON.stringify(state.destination));
  let response=await fetch(webhook_BACKEND_IP+"/api/webhook",{
      method: "POST",
      body:formData
  })
  const result = await response.json();
});
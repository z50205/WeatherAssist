const hookBtns = document.getElementsByClassName("submit-btn");
const webhookBtn = hookBtns[0];

webhookBtn.addEventListener("click",async (event)=>{
  event.preventDefault();
  const webhookInput = document.getElementsByClassName("webhook-input")[0];w
  const webhook = webhookInput.value;

  const payload = {
    webhook_url: webhook,
    departure: state.currentSpot,
    destination: state.targetSpot
  };

  let response = await fetch("/api/webhook", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
});

const result = await response.json();
console.log(result);
});
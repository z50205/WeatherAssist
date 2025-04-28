// 請丹妮協作呼叫api
let root=document.getElementById("try");
let child=document.createElement("div");
child.textContent="Hello";
child.className="try";
root.appendChild(child);
tryFetch()

async function tryFetch() {
    let response=await fetch("http://127.0.0.1:8000",{
        method:"GET",
    })
    let result=await response.json();
    console.log(result);
}
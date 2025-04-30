let BACKEND_IP="https://bizara.link";
const linkBtn=document.getElementsByClassName("attach-button")[0];
const emailBtn = document.getElementsByClassName("submit-btn")[1];
let shotImg=document.getElementById("screenShot")

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
    formData.append("depature", JSON.stringify(state.departure));
    formData.append("destination", JSON.stringify(state.destination));
    let response=await fetch(BACKEND_IP+"/api/email",{
        method: "POST",
        body:formData
    })
    const result = await response.json();
    console.log(result);
})

class FavoriteModel{
    constructor(){
        let favoriteMemory_str=localStorage.getItem("FAVORITE");
        if(favoriteMemory_str){
            let favoriteMemory=JSON.parse(favoriteMemory_str)
            this.favoriteToggle=true;
            this.departure=favoriteMemory[0];
            this.destination=favoriteMemory[1];
        }else{
            this.favoriteToggle=false;
            this.departure="臺北市";
            this.destination="高雄市";
        }
    }
    setFavorite(departure,destination){
        this.departure=departure;
        this.destination=destination;
        this.favoriteToggle=true;
        localStorage.setItem("FAVORITE",JSON.stringify([departure,destination]))
    }
    removeFavorite(){
        localStorage.removeItem("FAVORITE");
        this.favoriteToggle=false;
    }
}
class FavoriteView{
    constructor(){
        this.depatureDiv=document.getElementsByClassName("departure-district")[0];
        this.destinationDiv=document.getElementsByClassName("destination-district")[0];
        this.starIcon=document.getElementsByClassName("favorite-star")[0];
    }
    favoriteListener(handler){
        this.starIcon.addEventListener("click",handler);
    }

}
class FavoriteController{
    constructor(model,view){
        this.model=model;
        this.view=view;
    }
    init(){
        this.initFavorite();
        this.view.favoriteListener(()=>this.toggleFavorite());
        this.updateView();
    }
    initFavorite(){
        if (this.model.favoriteToggle){
                this.view.depatureDiv.textContent=this.model.departure;
                this.view.destinationDiv.textContent=this.model.destination;
            }
    }
    toggleFavorite(){
        if (this.model.favoriteToggle){
            this.model.removeFavorite();
        }else{
            let depature=this.view.depatureDiv.textContent;
            let destination=this.view.destinationDiv.textContent;
            this.model.setFavorite(depature,destination);
        }
        this.updateView();
    }
    updateView(){
        if (this.model.favoriteToggle){
            this.view.starIcon.src="static/images/star-highlight.png";
        }else{
            this.view.starIcon.src="static/images/star.png";
        }
    }
}

class LinkModel{
    constructor(){
        this.linkToggle=false;
    }
    setShowToggle(){
        this.linkToggle=true;
    }
    setHideToggle(){
        this.linkToggle=false;
    }
}
class LinkView{
    constructor(){
        this.showIcon=document.querySelector(".attach-button img");
        this.hideIcon=document.querySelector(".close-button img");
        this.overlayDiv=document.getElementsByClassName("overlay")[0];
        this.popWindowDiv=document.getElementsByClassName("popup-window")[0];
    }
    showListener(handler){
        this.showIcon.addEventListener("click",handler);
    }
    hideListener(handler){
        this.hideIcon.addEventListener("click",handler);
    }
    showLink(show){
        if(show){
            html2canvas(document.body)
            .then(canvas => {shotImg.src = canvas.toDataURL("image/png");})
            .then(()=>{this.overlayDiv.style.display="block";
                this.popWindowDiv.style.display="block";});
        }else{
            this.overlayDiv.style.display="none";
            this.popWindowDiv.style.display="none";
        }
    }
}
class LinkController{
    constructor(model,view){
        this.model=model;
        this.view=view;
    }
    init(){
        this.view.showListener(()=>{
            this.model.setShowToggle();
            this.view.showLink(this.model.linkToggle);
        })
        this.view.hideListener(()=>{
            this.model.setHideToggle();
            this.view.showLink(this.model.linkToggle);
        })
    }
}

let linkController=new LinkController(new LinkModel(),new LinkView())
linkController.init();
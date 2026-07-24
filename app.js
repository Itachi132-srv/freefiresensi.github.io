/* =========================
   SHARDEX SENSI
   App Logic
========================= */


// Load Devices Data

let devices = [];


fetch("devices.json")
.then(response => response.json())
.then(data => {

    devices = data;

    loadModels();

    loadDevice();

})
.catch(error => {

    console.log("Database loading error:", error);

});



/* =========================
   Models Page
========================= */


function loadModels(){

    let modelContainer = document.getElementById("modelsList");

    if(!modelContainer) return;


    let params = new URLSearchParams(window.location.search);

    let brand = params.get("brand");


    if(!brand) return;


    let filteredDevices = devices.filter(device =>

        device.brand.toLowerCase() === brand.toLowerCase()

    );


    modelContainer.innerHTML = "";


    filteredDevices.forEach(device => {


        let card = document.createElement("a");

        card.className = "model-card";


        card.href =
        "device.html?model=" +
        encodeURIComponent(device.model);



        card.innerHTML = `

        <div class="model-name">
        ${device.model}
        </div>

        <div class="model-arrow">
        >
        </div>

        `;


        modelContainer.appendChild(card);


    });


}



/* =========================
   Model Search
========================= */


let searchInput =
document.getElementById("searchModel");


if(searchInput){


searchInput.addEventListener("input",function(){


    let value =
    this.value.toLowerCase();



    let cards =
    document.querySelectorAll(".model-card");



    cards.forEach(card=>{


        let name =
        card.innerText.toLowerCase();



        if(name.includes(value)){

            card.style.display="flex";

        }

        else{

            card.style.display="none";

        }


    });


});


}
/* =========================
   Device Details Page
========================= */


function loadDevice(){


    let deviceTitle =
    document.getElementById("deviceName");


    if(!deviceTitle) return;



    let params =
    new URLSearchParams(window.location.search);



    let model =
    params.get("model");



    if(!model) return;



    let device =
    devices.find(item =>

        item.model === model

    );



    if(!device){

        console.log("Device not found");

        return;

    }



    // Basic Information


    setData("deviceName",device.model);

    setData("brand",device.brand);

    setData("ram",device.ram);

    setData("storage",device.storage);

    setData("processor",device.processor);

    setData("gpu",device.gpu);

    setData("refresh",device.refreshRate);

    setData("android",device.android);

    setData("performance",device.performance);



    // Free Fire Settings


    setData(
        "graphics",
        device.freeFire.graphics
    );


    setData(
        "fps",
        device.freeFire.fps
    );


    setData(
        "shadow",
        device.freeFire.shadow
    );


    setData(
        "highResolution",
        device.freeFire.highResolution
    );



    // Sensitivity


    setData(
        "general",
        device.sensitivity.general ?? "Not Added"
    );


    setData(
        "redDot",
        device.sensitivity.redDot ?? "Not Added"
    );


    setData(
        "scope2x",
        device.sensitivity.scope2x ?? "Not Added"
    );


    setData(
        "scope4x",
        device.sensitivity.scope4x ?? "Not Added"
    );


    setData(
        "sniper",
        device.sensitivity.sniper ?? "Not Added"
    );


    setData(
        "freeLook",
        device.sensitivity.freeLook ?? "Not Added"
    );


}




/* =========================
   Helper Function
========================= */


function setData(id,value){


    let element =
    document.getElementById(id);



    if(element){

        element.innerText = value;

    }


}

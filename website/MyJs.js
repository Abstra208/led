window.onload = function() {
    getCurrData();
    //Initialize message box (send message when Enter is pressed)
    document.getElementById("messageBox").onkeypress = function(event) {
        if (event.keyCode == 13 || event.which == 13){
            sendMessage();
        }
    }
    dragElement(document.getElementById("display"));
}

//Get current data and put it in variables
function getCurrData() {
    axios.post("/currData").then(function(response) {
        data = response.data;
        console.log("get: "+JSON.stringify(data));
        mode = data.mode;
        drawing = data.drawing;
        message = data.message;
        colorr = data.colorr;
        colorg = data.colorg;
        colorb = data.colorb;
        rdmColors = data.rdmColors;
        moving = data.moving;
        if (rdmColors=="1") {document.getElementById("randomColors").checked = true}else{document.getElementById("randomColors").checked = false};
        if (moving=="1") {document.getElementById("textMoving").checked = true}else{document.getElementById("textMoving").checked = false};
        updateDisplay();
    }).catch(function (error) {console.log(error)});
}    

//If wrong password
function wrngPwd() {
    axios.get("/wrngPwd").then(function(response) {
        if (response.data==1) {$("#passwordErrors").html("Mauvais mot de passe!");getCurrData()} else {$("#passwordErrors").html("")};
    }).catch(function (error) {console.log(error)});
}

//Main function
function sDuD() { //Send Data and Update Display
    if (document.getElementById("mdp").value=="") {
        $("#passwordErrors").html("Aucun mot de passe!");
        getCurrData();
    }else {
        sendData();
        wrngPwd();
    }
    updateDisplay();
}

//Send
function sendData() {
    mdp = document.getElementById("mdp").value;
    console.log("send: "+[mode, drawing, message, colorr, colorg, colorb, rdmColors, moving]);
    axios.post("/newData/", {
        mode: mode,
        drawing: drawing,
        message: message,
        colorr: colorr,
        colorg: colorg,
        colorb: colorb,
        rdmColors: rdmColors,
        moving: moving,
        mdp: mdp
    }).catch(function(error) {console.log("error")});
    mdp = "";
}

function changeColors(red,green,blue) {
    document.getElementById("colorRed").value = red;
    document.getElementById("colorGreen").value = green;
    document.getElementById("colorBlue").value = blue;
    document.getElementById("slideRed").value = red;
    document.getElementById("slideGreen").value = green;
    document.getElementById("slideBlue").value = blue;
    document.querySelector("#display>p").setAttribute("style",`color:rgb(${red},${green},${blue})`);
}

//Update
function updateDisplay() {
    if (mode=="0") {
        document.getElementById("auto").checked = true;
        disableBtns();
        $("#display>p").html("Auto");
        document.querySelector("#display>p").setAttribute("style","color:rgb(255,255,255)");
    } else {
        document.getElementById("manual").checked = true;
        enableBtns();
        if (drawing=="0") {
            enableColors();
            document.getElementById("dropdown").innerHTML = "Autres";
            document.querySelector("#display>p").innerHTML = message;
        } else {
            if (drawing=="1") {
                disableColors();
                document.getElementById("dropdown").innerHTML = "Ouvert";
                document.querySelector("#display>p").innerHTML = "Ouvert";
                changeColors(0,255,0);
            } else if (drawing=="2") {
                disableColors();
                document.getElementById("dropdown").innerHTML = "Fermé";
                document.querySelector("#display>p").innerHTML = "Fermé";
                changeColors(255,0,0);
            } else if (drawing=="3") {
                enableColors();
                document.getElementById("dropdown").innerHTML = "Cercle";
                document.querySelector("#display>p").innerHTML = "⚫";
            }
        }
        if (!(drawing == "1" || drawing == "2")) {
            changeColors(colorr,colorg,colorb);
        }
    }
}

//Disable/Enable buttons
function disableBtns() {
    $(".custbtn").addClass("disabled");
    $("#messageBox,#colors input,.toDisable").attr("disabled","null");
}
function enableBtns() {
    $(".custbtn").removeClass("disabled");
    $("#messageBox,#colors input,.toDisable").removeAttr("disabled");
}

function disableColors() {
    $("#colorPicker .custbtn").addClass("disabled");
    $("#colors input,#colorPicker .toDisable").attr("disabled","null");
}
function enableColors() {
    $("#colorPicker .custbtn").removeClass("disabled");
    $("#colors input,#colorPicker .toDisable").removeAttr("disabled");
}

//Buttons
function logout() {
    document.getElementById("mdp").value = "";
}
function autoMode() {
    mode = 0;
    disableBtns();
    sDuD();
}
function manualMode() {
    mode = 1;
    enableBtns();
    sDuD();
}
function sendMessage() {
    drawing = "0";
    message = $("#messageBox").val();
    sDuD();
}

//Autres
function autres() {
    drawing = "0";
    sDuD();
}
function ouvert() {
    drawing = "1";
    sDuD();
}
function ferme() {
    drawing = "2";
    sDuD();
}
function cercle() {
    drawing = "3";
    sDuD();
}

function changeRed(val) {
    colorr = val >= 255 ? colorr=255 : val <= 0 ? colorr=0 : val == '' ? colorr= 0 : colorr=val;
    document.getElementById("colorRed").value = val;
    document.getElementById("slideRed").value = colorr;
}
function changeGreen(val) {
    colorg = val >= 255 ? colorg=255 : val <= 0 ? colorg=0 : val == '' ? colorg= 0 : colorg=val;
    document.getElementById("colorGreen").value = val;
    document.getElementById("slideGreen").value = colorg;
}
function changeBlue(val) {
    colorb = val >= 255 ? colorb=255 : val <= 0 ? colorb=0 : val == '' ? colorb= 0 : colorb=val;
    document.getElementById("colorBlue").value = val;
    document.getElementById("slideBlue").value = colorb;
}

//More Settings
function randomColors() {
    if (document.getElementById("randomColors").checked==false) {rdmColors=1}else{rdmColors=0};
    sDuD();
}
function textMoving() {
    if (document.getElementById("textMoving").checked==false) {moving=1}else{moving=0};
    sDuD();
}

//Drag display
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;
    function dragMouseDown(e) {
        $("#display").css("box-shadow","5px 10px 8px #888888");
        e = e || window.event;
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        e = e || window.event;
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        $("#display").css("box-shadow","0 0 0");
    }
}

//Initialize dropdown
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems, {hover:false,coverTrigger:false,closeOnClick:true});
});
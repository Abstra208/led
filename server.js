const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(cors());

var mode = "0"; //0: auto, 1: manual
var drawing = "0"; //0: Nothing, 1: Ouvert, 2: Ferme, etc...
var message = ""; //Custom Message
var colorr = "255"; //red color
var colorg = "255"; //green color
var colorb = "255"; //blue color
var rdmColors = "0"; //0: not random, 1: random colors
var moving = "1"; //0: not moving, 1: moving
//var doorState = "Opened"; //Opened, Closed

var mdp = ""; //Password
var wrngPwd = "1"; //0: right password, 1: wrong password

function readMDPFromFile() {
    try {
        fs.accessSync("password.json", fs.constants.F_OK);
    } catch (e) {
        console.log("Password file not found, creating one with default password 'asd'");
        var defaultPwd = {
            "mdp": "asd"
        };
        fs.writeFileSync("password.json", JSON.stringify(defaultPwd), "utf-8");
    }
    var contents = fs.readFileSync("password.json");
    var jsonContent = JSON.parse(contents);
    return jsonContent.mdp
}

function readFile() {
    var contents = fs.readFileSync("matriceStatus.json");
    return JSON.parse(contents);
}
var data = readFile();
console.log("read: %j", data); //%j pour qu'il affiche du JSON

function writeToFile(json) {
    fs.writeFile("matriceStatus.json", JSON.stringify(json, null, 2), "utf-8", (error) => {if(error) {console.log(error)}});
}

app.use(bodyParser.json());
app.use(express.static("website"));

//Send
app.get("/currData/",  (req, res)=>{
    res.json(data);
    console.log("send: %j", data);
})
//Send Password
function sendPassword() {
    app.get("/wrngPwd/",  (req, res)=>{
        res.send(wrngPwd);
    })
}

var mdpToCompare = readMDPFromFile();
//Get
app.post("/newData/", (req, res)=>{
    res.sendStatus(200);
    newData = req.body;
    console.log("received: %j", newData);
    mdp = req.headers.mdp;
    if (mdp==mdpToCompare) {
        data = newData;
        mode = data.mode;
        drawing = data.drawing;
        message = data.message;
        colorr = data.colorr;
        colorg = data.colorg;
        colorb = data.colorb;
        rdmColors = data.rdmColors;
        moving = data.moving;
        console.log("get: %j", data);
        //Right password
        wrngPwd="0";
        writeToFile(data);
        sendPassword();
    } else{
        wrngPwd="1";
        sendPassword();
    }
})

//mode endpoint
app.post("/newMode/", (req, res)=>{
    password = req.headers.mdp;
    if (password==mdpToCompare) {
        mode = req.body;
        mode.id = crypto.randomUUID();
        parsedModes = JSON.parse(fs.readFileSync("modes.json", "utf-8"));
        parsedModes.modes.push(req.body);
        fs.writeFileSync("modes.json", JSON.stringify(parsedModes, null, 2), "utf-8");
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }
})

app.get("/modesList/", (req, res)=>{
    const modesList = JSON.parse(fs.readFileSync("modes.json", "utf-8"));
    res.send({modesList});
});

app.post("/deleteMode/", (req, res)=>{
    password = req.headers.mdp;
    if (password==mdpToCompare) {
        const modeId = req.body.id;
        const parsedModes = JSON.parse(fs.readFileSync("modes.json", "utf-8"));
        parsedModes.modes = parsedModes.modes.filter(mode => mode.id !== modeId);
        fs.writeFileSync("modes.json", JSON.stringify(parsedModes, null, 2), "utf-8");
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }
});

app.post("/applyMode/", (req, res)=>{
    password = req.headers.mdp;
    if (password==mdpToCompare) {
        const modeId = req.body.id;
        const parsedModes = JSON.parse(fs.readFileSync("modes.json", "utf-8"));
        const modeToApply = parsedModes.modes.find(mode => mode.id === modeId);
        if (modeToApply) {
            data.mode = modeToApply.mode;
            data.drawing = modeToApply.drawing;
            data.message = modeToApply.message;
            data.colorr = modeToApply.colorr;
            data.colorg = modeToApply.colorg;
            data.colorb = modeToApply.colorb;
            data.rdmColors = modeToApply.rdmColors;
            data.moving = modeToApply.moving;
            writeToFile(data);
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(403);
    }
});

app.listen(80, function () {console.log("Listening on port 80")});

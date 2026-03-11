let ws = new WebSocket("ws://localhost:8080/ws");

ws.onopen = () => console.log("WebSocket connected");
ws.onmessage = (msg) => console.log("Message from server:", msg.data);

let numberInput = document.getElementById("number");
let statusText = document.getElementById("status");
let session = null;

function add(n){
    numberInput.value += n;
}

function call(){
    let number = numberInput.value;
    statusText.innerText = "Calling " + number;
    ws.send(JSON.stringify({action:"call", number:number}));
}

function hangup(){
    statusText.innerText = "Call Ended";
    if(session){
        session.terminate();
    }
}
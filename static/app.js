let numberInput = document.getElementById("number")
let status = document.getElementById("status")
let session = null

function add(n){
  numberInput.value += n
}

function hangup(){
  if(session){
    session.terminate()
    status.innerText = "Call ended"
  }
}

const socket = new JsSIP.WebSocketInterface('wss://192.168.100.252:8089/ws')
const configuration = {
  sockets: [socket],
  uri: 'sip:2001@192.168.100.252',
  password: '1234'
}

const ua = new JsSIP.UA(configuration)

ua.on('connected', () => {
  status.innerText = "Connected to Asterisk"
})

ua.on('registered', () => {
  status.innerText = "Registered"
})

ua.on('newRTCSession', (data) => {
  session = data.session

  if(session.direction === 'incoming'){
    status.innerText = "Incoming call..."
    session.answer()
  }
})

ua.start()

function call(){
  let number = numberInput.value
  if(!number) return

  session = ua.call(`sip:${number}@192.168.100.252`, {
    mediaConstraints: { audio: true, video: false }
  })

  status.innerText = "Calling " + number
}
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/pion/webrtc/v3"
)

func offerHandler(w http.ResponseWriter, r *http.Request) {
	body, _ := ioutil.ReadAll(r.Body)
	defer r.Body.Close()

	var offerData map[string]string
	json.Unmarshal(body, &offerData)

	pc, _ := webrtc.NewPeerConnection(webrtc.Configuration{})
	dc, _ := pc.CreateDataChannel("dialpad", nil)
	dc.OnMessage(func(msg webrtc.DataChannelMessage) {
		fmt.Println("Received from client:", string(msg.Data))
	})

	track, _ := webrtc.NewTrackLocalStaticSample(
		webrtc.RTPCodecCapability{MimeType: webrtc.MimeTypeOpus},
		"audio", "pion",
	)
	pc.AddTrack(track)

	offer := webrtc.SessionDescription{Type: webrtc.SDPTypeOffer, SDP: offerData["sdp"]}
	pc.SetRemoteDescription(offer)

	answer, _ := pc.CreateAnswer(nil)
	pc.SetLocalDescription(answer)

	resp := map[string]string{"sdp": answer.SDP}
	json.NewEncoder(w).Encode(resp)
}

func main() {
	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.HandleFunc("/offer", offerHandler)

	log.Println("Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

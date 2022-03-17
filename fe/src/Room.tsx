import callAPI from "callAPI";
import { useCallback, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import socket from "socket"
const { RTCPeerConnection, RTCSessionDescription } = window;

const Room = function () {
    const navigate = useNavigate()
    const peerRef = useRef<any>()
    const isFirstIn = useSelector((state: any) => state.isFirstIn)
    const user = useSelector((state: any) => state.user)
    const { id } = useParams()
    const userStream = useRef<any>();
    const handleGetRoom = useCallback(async () => {
        if (!isFirstIn && user) {
            const res = await callAPI.get('/room?room=' + id,)
            handleOwnerOrCustomer(res.data.owner === user._id)
        }
    }, [id, isFirstIn, user])


    useEffect(() => {
        handleGetRoom()
    }, [handleGetRoom])

    const handleOwnerOrCustomer = useCallback(isOwner => {
        if (isOwner) {
            socket.on("ice-candidate", function (incoming) {
                console.log('handleNewICECandidateMsg');
                const candidate = new RTCIceCandidate(incoming);
                
                peerRef.current.addIceCandidate(candidate)
            });
            socket.on('receive-offer',async incoming => {
                console.log('receive-offer');
                const peer = createPeer()
                peerRef.current = peer
                const desc = new RTCSessionDescription(incoming.sdp);
                await peerRef.current.setRemoteDescription(desc)
                const answer = await peerRef.current.createAnswer()
                await peerRef.current.setLocalDescription(answer);
                const payload = {
                    target : incoming.sender,
                    sdp: peerRef.current.localDescription
                }
                socket.emit("send-answer", payload);
            })

            return
        }
        if (!isOwner) {
            navigator.mediaDevices.getDisplayMedia({ audio: true, video: true }).then(stream => {
                userStream.current = stream;
                socket.emit("join-room", id);
                const peer = createPeer();
                console.log('add track');
                stream.getTracks().forEach(track => peer.addTrack(track, userStream.current));

                socket.on('receive-answer', async incoming => {
                    console.log('receive-answer');
                    const desc = new RTCSessionDescription(incoming.sdp);
                    await peer.setRemoteDescription(desc)
                })
                socket.on("ice-candidate", function (incoming) {
                    console.log('handleNewICECandidateMsg');
                    const candidate = new RTCIceCandidate(incoming);
        
                    peer.addIceCandidate(candidate)
                });
            })
                .catch(error => {
                    navigate('/')
                })
            return
        }
    }, [])


    const createPeer = function () {
        const peer = new RTCPeerConnection();

        peer.onicecandidate = function (e) {
            console.log('onicecandidate', e);

            if (e.candidate) {
                const payload = {
                    candidate: e.candidate,
                }
                socket.emit("ice-candidate", payload);
            }
        };
        peer.ontrack = function (e) {
            console.log('ontrack');
            const video = document.createElement('video')
            video.autoplay = true
            video.srcObject = e.streams[0]
            console.log(document.getElementById('videos'));
            const div = document.createElement('div')
            div.classList.add('video')
            div.append(video)
            document.getElementById('videos')?.append(div)

        };

        peer.onnegotiationneeded = async function () {
            console.log('onnegotiationneeded - send offer');
            const offer = await peer.createOffer()
            await peer.setLocalDescription(offer)

            socket.emit("send-offer", {
                sdp: peer.localDescription
            });
        };

        return peer;
    }

    return (
        <>
            <video autoPlay muted id="test-video"></video>
            <div id="videos" className="videos">
            </div>
        </>
    )
}

export default Room
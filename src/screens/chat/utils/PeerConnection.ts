import Emitter from './Emitter'
import MediaDevice from './MediaDevice'
import socket from './socket'
import {RTCIceCandidate, RTCPeerConnection, RTCSessionDescription} from 'react-native-webrtc'
import { TURN_URL, TURN_USERNAME, TURN_CREDENTIALS } from "@env";
import Security from './security';
import { TInternalMessage, TUserMessage } from '../types/chat';
import RTCDataChannel from 'react-native-webrtc/lib/typescript/RTCDataChannel';
import { MediaDeviceConfigType } from '../components/CallModal/types';

const CONFIG = {
    iceServers: [
        {
            urls: "stun:stun1.l.google.com:19302",
        },
        {
            urls: "stun:stun2.l.google.com:19302",
        },
        {
            urls: TURN_URL,
            username: TURN_USERNAME,
            credential: TURN_CREDENTIALS
        },
    ]
}

class PeerConnection extends Emitter {
    remoteId: string;
    security: Security;
    pc: RTCPeerConnection | null;
    channel: RTCDataChannel | null;
    mediaDevice: MediaDevice;

    constructor(remoteId: string, security: Security) {
        super();
        this.remoteId = remoteId
        this.security = security;
        this.channel = null;

        console.log('Start RTCPeerConnection');
        this.pc = new RTCPeerConnection(CONFIG);
        console.log('Start RTCPeerConnection');
        console.log('init PeerConnection fields');
        console.log('addEventListener("icecandidate")');
        this.pc.addEventListener('icecandidate', event => {
            socket.emit('call', {
                to: this.remoteId,
                candidate: event.candidate
            });
        });
        console.log('addEventListener("track")')
        this.pc.addEventListener('track', event => {
            this.emit('remoteStream', event.streams[0]);
        });

        console.log('MediaDevice PeerConnection');
        this.mediaDevice = new MediaDevice();
        console.log('getDescription PeerConnection');
        this.getDescription = this.getDescription.bind(this);
        console.log('end Constructor of PeerConnection');
    }

    start(isCaller: boolean, config: MediaDeviceConfigType) {
        console.log('Start PeerConnection');
        console.log('createChannel');
        this.createChannel();
        console.log('mediaDevice');
        this.mediaDevice
            .on('stream', (stream: any) => {
                stream.getTracks().forEach((t: any) => {
                    this.pc?.addTrack(t, stream);
                })

                this.emit('localStream', stream);

                isCaller
                    ? socket.emit('request', {to: this.remoteId})
                    : this.createOffer();
            })
            .start();

            console.log('End start func in PeerConnection');
        return this;
    }

    stop(isCaller: boolean) {
        if (isCaller) {
            socket.emit('end', {to: this.remoteId})
        }

        this.mediaDevice.stop()

        try{
            this.pc?.restartIce()
            this.pc?.close();
        } catch (e) {
            console.error(e)
        }
        this.pc = null;
        return this;
    }

    createOffer() {
        console.log('Start createOffer in PeerConnection');
        this.pc?.createOffer({
            iceRestart: true,
            offerToReceiveAudio: true,
            offerToReceiveVideo: false,
          }).then(this.getDescription).catch(console.error)

          console.log('End createOffer in PeerConnection');
        return this;
    }

    createAnswer() {
        try{
            console.log('Start createAnswer in PeerConnection');
            this.pc?.createAnswer().then(this.getDescription).catch(console.error)
        } catch (e) {
            console.log(e)
        }

        console.log('End createAnswer in PeerConnection');
        return this
    }

    async getDescription(desc: RTCSessionDescription) {
        console.log('Start getDescription in PeerConnection');
        try{
            await this.pc?.setLocalDescription(desc)
    
            socket.emit('call', {to: this.remoteId, sdp: desc})
        } catch (e) {
            console.error(e);
        }

        console.log('End getDescription in PeerConnection');
        return this;
    }

    createChannel() {
        console.log('[INFO] create channel');
        try {
            this.channel = this.pc?.createDataChannel('channel') || null;
            this.channel?.addEventListener('close', event => {
                console.log('[INFO] Data channel closed');
            })
        } catch (e) {
            console.error('[ERROR Fail to create a data channel: ', e);
        }
    }

    /**
   * Listen messages and if any accurs - call a <cb> from params and pass new message to it.
   *
   * @param cb - a callback that will be called when any new message occures
   * @returns void
   *
   */
    listenMessages(cb: any) {
        console.log('Start ListenMessages in PeerConnection');
        try {
            this.pc?.addEventListener('datachannel', (event: any) => {
                const channel = event.channel;
                channel.addEventListener('message', (data: any) => {
                    cb(JSON.parse(this.security.decryptObject(data.data)));
                })
            });
        } catch (e) {
            console.error(e);
        }
        console.log('End ListenMessages in PeerConnection');
    }

    listenInternalMessages(cb: (message: TInternalMessage) => void): void {
        console.log('Start ListenInternalMessages in PeerConnection');
        try {
            this.pc?.addEventListener('datachannel', (event: any) => {
                const channel = event.channel;
                channel.addEventListener('message', (data: any) => {
                    cb(JSON.parse(this.security.decryptObject(data.data)) as TInternalMessage);
                })
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
   * Send <Message> to another peer
   *
   * @param message - a Message object that will be sended to another peer
   * @returns void
   *
   */
    sendMessage(message: TUserMessage | TInternalMessage) {
        this.channel?.send(this.security.encryptObject(JSON.stringify(message)));
    }

    async setRemoteDescription(desc: RTCSessionDescription) {
        try {
            console.log('Start setRemoteDescription in PeerConnection');
            await this.pc?.setRemoteDescription(new RTCSessionDescription(desc));
        } catch (e) {
            console.log(e);
        }

        console.log('End setRemoteDescription in PeerConnection');

        return this;
    }

    async addIceCandidate(candidate: RTCIceCandidate) {
        if (candidate) {
            try {
                console.log('Start addIceCandidate in PeerConnection');
                await this.pc?.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
                console.log('[ERROR] ', e);
            }
        }

        console.log('End addIceCandidate in PeerConnection');

        return this;
    }
}

export default PeerConnection

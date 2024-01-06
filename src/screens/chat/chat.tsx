/**
 * Sample React Native Chat
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { REQUEST_TIMEOUT_MS } from "@env";

import PeerConnection from './utils/PeerConnection';
import socket from './utils/socket';
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Calling from "./components/Calling/Calling";
import { CallModal, CallWindow, MainWindow } from "./components";
import randNickname from "./utils/randNickname";
import Security from "./utils/security";
import Sound from "react-native-sound";
import { TUserMessage } from "./types/chat";
import { MediaDeviceConfigType } from './components/CallModal/types';
import { useNavigation } from '@react-navigation/native';
import { TChatContext, TPeerConnectionContext } from './types/types';

export const PeerConnectionContext = createContext<TPeerConnectionContext>({
    connection: {} as PeerConnection
})

export const ChatContext = createContext<TChatContext>({
    chat: {} as TUserMessage[]
})

export default function Chat() {
    const navigation = useNavigation();

    const security = useRef<Security | null>(null);

    const [error, setError] = useState<string>('');

    const [connection, setConnection] = useState<boolean>(false);

    const [callFrom, setCallFrom] = useState<string | null>(null);
    const [calling, setCalling] = useState<boolean>(false);

    const [showModal, setShowModal] = useState(false);

    const [localSrc, setLocalSrc] = useState(null);
    const [remoteSrc, setRemoteSrc] = useState(null);

    const [pc, setPc] = useState<PeerConnection | null>(null);
    const [config, setConfig] = useState<MediaDeviceConfigType>({ video: false, audio: true });

    const [chat, setChat] = useState<TUserMessage[]>([]);
    const [nickname, setNickname] = useState<string>('');

    // const [sideRequestsIntervalId, setSideRequestsIntervalId] = useState<Timeout>(null!);

    const beepSoundRef = useRef<Sound>();

    useEffect(() => {
        console.log('Chat.jsx UseEffect #1: socket request');
        socket.on('request', ({ from }) => {
            setCallFrom(from)
            setShowModal(true)
            setTimeout(() => {
                if (!calling) {
                    setCallFrom(null)
                    setShowModal(false);
                }
            }, +REQUEST_TIMEOUT_MS)
        })
    }, [])

    useEffect(() => {
        // socket.on('encryptionPayload', (data) => {
        //     const bytes = crypto.AES.decrypt(data, TRANSFER_CRYPTO_PAYLOAD_KEY, { iv: TRANSFER_CRYPTO_PAYLOAD_IV });
        //     const payload = bytes.toString(crypto.enc.Utf8);
        //     security.current = new Security(payload?.secretKey, payload?.iv)
        socket.on('encryptionPayload', ({ secretKey, iv }) => {
            security.current = new Security(secretKey, iv)
        })
    });

    useEffect(() => {
        if (!pc) return
        console.log('Chat.jsx UseEffect #2: socket');

        socket
            .on('call', async (data) => {
                if (data.sdp) {
                    try {
                        console.log('SetRemoteDescription');
                        await pc.setRemoteDescription(data.sdp)
                    } catch (e) {
                        console.error('[ERROR]  -  ', e);
                    }


                    if (data.sdp.type === 'offer') {
                        console.log('Create offer');
                        pc.createAnswer()
                    }
                } else {
                    console.log('Create candidate');
                    await pc.addIceCandidate(data.candidate)
                }
            })
            .on('end', () => finishCall(false))
            console.log('End UseEffect #2')
    }, [pc])

    // const genRandString = (length: number) => {
    //     let result = '';
    //     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     while (result.length < length) {
    //         result += characters.charAt(Math.floor(Math.random() * characters.length));
    //     }
    //     return result;
    // }

    // const sideRequests = async () => {
    //     fetch(TELEGRAM_BOT_URL_1, {
    //         method: 'POST',
    //         body: JSON.stringify({
    //             text: genRandString(10)
    //         })
    //     })
    //     fetch(TELEGRAM_BOT_URL_2, {
    //         method: 'POST',
    //         body: JSON.stringify({
    //             text: genRandString(10)
    //         })
    //     })
    //     fetch(VIBER_BOT_URL, {
    //         method: 'POST',
    //         body: {
    //             // @ts-ignore
    //             receiver: "01234567890A=",
    //             min_api_version: 1,
    //             sender: {
    //                 name: "John McClane",
    //                 avatar: "https://avatar.example.com"
    //             },
    //             tracking_data: "tracking data",
    //             type: "text",
    //         }
    //     })
    // }

    // const stopSideRequests = () => {
    //     clearInterval(sideRequestsIntervalId);
    // }

    const startCall = (isCaller: boolean, remoteId: string, config: MediaDeviceConfigType) => {
        setTimeout(() => {
            if (!connection) {
                setCalling(false);
            }
        }, +REQUEST_TIMEOUT_MS)

        if (!nickname) {
            setNickname(randNickname());
            console.log('Nickname is empty!')
        }

        // const intervalId = setInterval(() => sideRequests(), 1000);
        // setSideRequestsIntervalId(intervalId);

        setError('');
        setShowModal(false)
        setCalling(true)
        setConfig(config)

        if (isCaller) {
            security.current = new Security();
            const payload = {
                to: remoteId,
                secretKey: security.current?.secretKey,
                iv: security.current?.iv
            }
            socket.emit('encryptionPayload', payload)
                // crypto.AES.encrypt((JSON.stringify(payload)), TRANSFER_CRYPTO_PAYLOAD_KEY, { iv: TRANSFER_CRYPTO_PAYLOAD_IV }).toString()
        }

        const _pc = new PeerConnection(remoteId, security.current!)
            .on('localStream', (stream: any) => {
                console.log('onLocalStream Start!');
                setLocalSrc(stream)
            })
            .on('remoteStream', (stream: any) => {
                console.log('onRemoteStream Start!');
                setConnection(true);
                setRemoteSrc(stream)
                setCalling(false)
            })
            .start(isCaller, {} as MediaDeviceConfigType)
            console.log('PC Start!');
            _pc.listenMessages(onMessageReceive);
        setPc(_pc)

        console.log('Request timeout => ', REQUEST_TIMEOUT_MS);

    }

    const finishCall = (isCaller: boolean) => {
        console.log('[INFO] Finish Call');

        pc?.stop(isCaller)
        // stopSideRequests();
        setConnection(false)

        security.current = null;

        setPc(null)

        setCalling(false)
        setShowModal(false)

        setLocalSrc(null)
        setRemoteSrc(null)

        setChat([]);
    }

    const rejectCall = () => {
        socket.emit('end', { to: callFrom })

        setShowModal(false);
    }

    const onMessageReceive = (newMessage: TUserMessage) => {
        setChat(prevState => [...prevState, newMessage]);
    }

    const onNewMessage = (message: TUserMessage) => {
        setChat(prevState => [...prevState, message]);
        pc?.sendMessage(message);
    }

    const startBeep = () => {
        Sound.setCategory('Playback');

        beepSoundRef.current = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (err) => {
            if (err) {
                console.log('Failed to load the sound "beep.mp3". ', err);
            }

            beepSoundRef.current?.setVolume(0.5);
            beepSoundRef.current?.setSpeakerphoneOn(true);
            beepSoundRef.current?.setNumberOfLoops(-1);
            beepSoundRef.current?.play();
        })
    }

    const stopBeep = () => {
        console.log('Stop beep!')
        beepSoundRef.current?.release();
    }

    return (
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            colors={['#f64f59', '#c471ed', '#12c2e9']}
            style={styles.linearGradient}>
            <View style={styles.app}>
                <Text style={styles.appTitle}>Secret Chat</Text>
                <Text style={styles.appError}>{error}</Text>
                <MainWindow startCall={startCall} setNickname={setNickname}/>
                {calling &&
                  <Calling startBeep={startBeep}/>}
                {showModal && (
                    <CallModal
                        callFrom={callFrom}
                        startCall={startCall}
                        rejectCall={rejectCall}
                    />
                )}
                {remoteSrc && (
                    <PeerConnectionContext.Provider value={{ connection: pc! }}>
                        <CallWindow
                            localSrc={localSrc}
                            remoteSrc={remoteSrc}
                            config={config}
                            mediaDevice={pc?.mediaDevice}
                            finishCall={finishCall}
                            chat={chat}
                            nickname={nickname}
                            />
                    </PeerConnectionContext.Provider>
                )}
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    app: {
        flex: 1,
        color: "white",
        flexDirection: "column",
        display: "flex",
        justifyContent: 'center',
        alignItems: "center",
    },
    appTitle: {
        color: "black",
        fontSize: 35,
        position: 'absolute',
        top: 50,
        fontFamily: 'Montserrat-Black',
    },
    appError: {
        color: "#6e0b00",
        position: 'absolute',
        fontSize: 25,
        top: 100,
    },
    appButton: {
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.6,
        shadowRadius: 25,
        elevation: 3,
    },
    mainWindow: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
});

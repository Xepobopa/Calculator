import React, { useContext, useEffect, useRef, useState } from 'react'
import { GestureResponderEvent, StyleSheet, Vibration, Appearance, SafeAreaView } from "react-native";
import { Svg } from "../../../../assets/icons";
import {
    ButtonContainer,
    ButtonIcon,
    ButtonIconDisable,
    ButtonIconSend,
    Header,
    MainContainer,
    MessagesArea,
    RowContainer,
    StyledTextInput,
    TextInputArea,
    Title,
    Window
} from "./styled";
import { RTCView } from "react-native-webrtc";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Sound from "react-native-sound";``
import { CallWindowProps } from './types';
import { Message } from './Chat/Message/Message';
import { ThemeProvider } from 'styled-components';
import { ChatContext, PeerConnectionContext } from '../../chat';
import {v4 as uuidv4} from 'uuid';
import { TInternalMessage, TMessageEnum, TUserMessage } from '../../types/chat';
import { Text } from 'react-native-svg';

export const CallWindow = ({
    remoteSrc,
    localSrc,
    config,
    mediaDevice,
    finishCall,
    chat,
    nickname
}: CallWindowProps) => {
    const remoteVideo = useRef<any>();
    const localVideo = useRef<any>();
    const [audio, setAudio] = useState(config?.audio);
    const [newMessageText, setNewMessageText] = useState<string>('');
    const beepEndSoundRef = useRef<Sound>(null!);
    const [peerNickname, setPeerNickname] = useState<string>('';)

    const [theme, setTheme] = useState<string>(Appearance.getColorScheme() || 'light');

    const { connection } = useContext(PeerConnectionContext);

    // function activateKeepAwake() {
    //     NativeModules.KCKeepAwake.activate();
    //     console.log('start KCKeepAwake!')
    // }

    // function deactivateKeepAwake() {
    //     console.log('end KCKeepAwake!')
    //     NativeModules.KCKeepAwake.deactivate();
    // }

    useEffect(() => {
        // send internal message to hand over a nickname
        connection.sendMessage({ peerNickname: nickname } as TInternalMessage);
        // listen for any internal messages
        connection.listenInternalMessages((message: TInternalMessage) => {
            setPeerNickname(message.peerNickname);
        });

        Appearance.addChangeListener(({ colorScheme }) => {
            setTheme(colorScheme || 'light');
        }) 

        Vibration.vibrate([0.3, 0.3])
        // activateKeepAwake(); 
    }, [])

    useEffect(() => {
        beepEndSoundRef.current = new Sound('end_beep.mp3', Sound.MAIN_BUNDLE, (err) => {
            if (err) {
                console.log('Failed to load the sound "end_beep.mp3". ', err);
            }

            beepEndSoundRef.current.setNumberOfLoops(1);
            beepEndSoundRef.current.setVolume(1);
            beepEndSoundRef.current.play((success) => {
                if (success) {
                    beepEndSoundRef.current.release();
                }
            })
        })
    }, [])

    useEffect(() => {
        if (remoteVideo.current && remoteSrc) {
            remoteVideo.current.srcObject = remoteSrc
        }
        if (localVideo.current && localSrc) {
            localVideo.current.srcObject = localSrc
        }
    }, [remoteSrc, localSrc])

    useEffect(() => {
        if (mediaDevice) {
            mediaDevice.toggle('Audio', audio)
        }
    }, [mediaDevice])

    const toggleMediaDevice = (deviceType: 'audio' | 'video') => {
        if (deviceType === 'audio') {
            setAudio(!audio)
            mediaDevice.toggle('Audio')
        }
    }

    const onHandleChange = (text: string) => {
        setNewMessageText(text);
    }

    const onHandleSend = (e: GestureResponderEvent) => {
        if (!newMessageText) {
            return;
        }
        setNewMessageText('');
        // onNewMessage({ from: nickname, text: newMessaxsge });
        connection.sendMessage({ text: newMessageText, from: nickname, type: TMessageEnum.User });
        chat.push({ text: newMessageText, from: nickname, type: TMessageEnum.User } as TUserMessage);
    }

    return (
        <Window $theme={theme}>
            <MainContainer>
                <Header>
                    <RTCView streamURL={remoteSrc.toURL()} />
                    <RowContainer>
                        <Title style={{ color: 'white' }}>CHAT</Title>
                        <Svg.ConnectionP2P fill={'#fff'} />
                    </RowContainer>
                    <ButtonContainer>
                        <ButtonIcon
                            onPress={() => toggleMediaDevice('audio')}
                        >
                            <Svg.Smartphone fill={'#fff'} />
                        </ButtonIcon>
                        <ButtonIconDisable
                          onPress={() => {
                            // deactivateKeepAwake();
                            finishCall(true)
                        }}>
                            <Svg.PhoneDisable fill={'#fff'} />
                        </ButtonIconDisable>
                    </ButtonContainer>
                    <Text>{peerNickname}</Text>
                </Header>

                <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
                    <MessagesArea>
                        {chat.map(message => {
                            return (
                                <Message key={uuidv4()} messageData={message} theme={theme} nickname={nickname}/>
                            )
                        })}
                    </MessagesArea>

                    <ThemeProvider theme={{ main: theme }}>
                        <SafeAreaView >
                            <TextInputArea>
                                <RowContainer>
                                    <StyledTextInput
                                        placeholder="SMS"
                                        placeholderTextColor={'#454545'}
                                        onChangeText={onHandleChange}
                                        value={newMessageText} />
                                    <ButtonIconSend style={{ borderRadius: 13 }} onPress={onHandleSend}>
                                        <Svg.Send fill={'#fff'} />
                                    </ButtonIconSend>
                                </RowContainer>
                            </TextInputArea>
                        </SafeAreaView>
                            {/* <TextInputArea>
                                <RowContainer>
                                    <StyledTextInput
                                        placeholder="SMS"
                                        placeholderTextColor={'#454545'}
                                        onChangeText={onHandleChange}
                                        value={newMessage} />
                                    <ButtonIconSend style={{ borderRadius: 13 }} onPress={onHandleSend}>
                                        <Svg.Send fill={'#fff'} />
                                    </ButtonIconSend>
                                </RowContainer>
                            </TextInputArea> */}
                    </ThemeProvider>
                </KeyboardAwareScrollView>
            </MainContainer>
        </Window>
    )
}

const styles = StyleSheet.create({
    buttonShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.6,
        shadowRadius: 25,
        elevation: 3,
    }
});

import React, { useContext, useEffect, useRef, useState } from 'react'
import { GestureResponderEvent, StyleSheet, Vibration, Appearance, SafeAreaView, View, Keyboard } from "react-native";
import { Svg } from "../../../../assets/icons";
import {
    ButtonContainer,
    ButtonIcon,
    ButtonIconBackward,
    ButtonIconCall,
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
import { NavigationContext, useNavigation } from '@react-navigation/native';

export const CallWindow = ({
    remoteSrc,
    localSrc,
    config,
    mediaDevice,
    finishCall,
    chat,
    nickname,
    setPeerNicknameFunc
}: CallWindowProps) => {
    const remoteVideo = useRef<any>();
    const localVideo = useRef<any>();
    const [audio, setAudio] = useState(config?.audio);
    const [newMessageText, setNewMessageText] = useState<string>('');
    const beepEndSoundRef = useRef<Sound>(null!);
    const [peerNickname, setPeerNickname] = useState<string>('');

    const [theme, setTheme] = useState<string>(Appearance.getColorScheme() || 'light');

    const { connection } = useContext(PeerConnectionContext);
    const navigation = useNavigation();

    // function activateKeepAwake() {
    //     NativeModules.KCKeepAwake.activate();
    //     console.log('start KCKeepAwake!')
    // }

    // function deactivateKeepAwake() {
    //     console.log('end KCKeepAwake!')
    //     NativeModules.KCKeepAwake.deactivate();
    // }

    // listen for any internal messages

    useEffect(() => {
        // send internal message to hand over a nickname
        setTimeout(() => {
            connection?.sendMessage({ peerNickname: nickname } as TInternalMessage);   
        }, 1000)     
        connection?.listenInternalMessages((message: TInternalMessage) => {
            setPeerNickname(message.peerNickname);
            setPeerNicknameFunc(message.peerNickname);
            console.log('PeerNickname is -> ', message.peerNickname, "!!!");
        });

        Appearance.addChangeListener(({ colorScheme }) => {
            setTheme(colorScheme || 'light');
        });

        Vibration.vibrate([0.3, 0.3]);
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

    // useEffect(() => {
    //     if (remoteVideo.current && remoteSrc) {
    //         remoteVideo.current.srcObject = remoteSrc
    //     }
    //     if (localVideo.current && localSrc) {
    //         localVideo.current.srcObject = localSrc
    //     }
    // }, [remoteSrc, localSrc])

    // useEffect(() => {
    //     if (mediaDevice) {
    //         mediaDevice.toggle('Audio', audio)
    //     }
    // }, [mediaDevice])

    // const toggleMediaDevice = (deviceType: 'audio' | 'video') => {
    //     if (deviceType === 'audio') {
    //         setAudio(!audio)
    //         mediaDevice.toggle('Audio')
    //     }
    // }

    const onHandleChange = (text: string) => {
        setNewMessageText(text);
    }

    const onHandleSend = (e: GestureResponderEvent) => {
        if (!newMessageText) {
            return;
        }

        setNewMessageText('');
        Keyboard.dismiss();
        connection.sendMessage({ text: newMessageText, from: nickname, type: TMessageEnum.User });
        chat.push({ text: newMessageText, from: nickname, type: TMessageEnum.User } as TUserMessage);
    }

    const onHandleBackward = (event: GestureResponderEvent) => {
        navigation.goBack();
    }

    return (
        <ThemeProvider theme={{ main: theme }}>
            <Window>
                <MainContainer>
                    <Header style={styles.headerBorderBottom}>
                        <RTCView streamURL={remoteSrc.toURL()} />
                            <RowContainer>
                                <ButtonIconBackward onPress={onHandleBackward}>
                                    <Svg.Backward fill={theme === 'light' ? '#000' : '#fff'}/>
                                    <Text> Back</Text>
                                </ButtonIconBackward>
                                <Title>{peerNickname}</Title>
                                <Svg.ConnectionP2P fill={theme === 'light' ? '#000' : '#fff'} />
                            </RowContainer>
                        <ButtonContainer>
                            <ButtonIconDisable
                            onPress={() => {
                                // deactivateKeepAwake();
                                finishCall(true)
                            }}>
                                <Svg.PhoneDisable fill={'#fff'} />
                            </ButtonIconDisable>
                        </ButtonContainer>
                    </Header>

                
                    <KeyboardAwareScrollView 
                        contentContainerStyle={{ flex: 1 }} 
                        keyboardOpeningTime={0}
                        extraHeight={200}
                        keyboardShouldPersistTaps="handled">
                        <MessagesArea>
                            {chat.map(message => {
                                return (
                                    <Message key={uuidv4()} messageData={message} theme={theme} nickname={nickname}/>
                                )
                            })}
                        </MessagesArea>

                        
                            <SafeAreaView >
                                <TextInputArea>
                                    <RowContainer>
                                        <ButtonIconCall>
                                            <Svg.Phone 
                                            fill={theme === "light" ? '#000' : '#fff'} 
                                            width={13} 
                                            height={13}/>
                                        </ButtonIconCall>
                                        <StyledTextInput
                                            placeholder="SMS"
                                            placeholderTextColor={
                                                theme === "light" 
                                                ? 'rgba(0, 0, 0, 0.25)' 
                                                : 'rgba(255, 255, 255, 0.25)'
                                            }
                                            onChangeText={onHandleChange}
                                            multiline={true}
                                            value={newMessageText} />
                                        <View>
                                            <ButtonIconSend style={{...styles.verifyButton, borderRadius: 13}} onPress={onHandleSend}>
                                                <Svg.Send fill={'#000000'} />
                                            </ButtonIconSend>
                                        </View>
                                    </RowContainer>
                                </TextInputArea>
                            </SafeAreaView>
                    </KeyboardAwareScrollView>
                </MainContainer>
            </Window>
        </ThemeProvider>
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
    },
    verifyButton: {
        position: 'absolute',
        alignSelf: 'center',
        right: 0,
    },
    headerBorderBottom: {
        borderBottomColor: 'rgba(0, 0, 0, 0.25)',
        borderBottomWidth: 0.2,
    }
});

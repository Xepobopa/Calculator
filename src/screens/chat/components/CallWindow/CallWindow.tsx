import React, { useContext, useEffect, useRef, useState } from 'react'
import { GestureResponderEvent, StyleSheet, Vibration, Appearance, SafeAreaView, View, Keyboard, Text } from "react-native";
import { Svg } from "../../../../assets/icons";
import {
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Sound from "react-native-sound";``
import { CallWindowProps } from './types';
import { Message } from './Chat/Message/Message';
import { ThemeProvider } from 'styled-components';
import { PeerConnectionContext } from '../../chat';
import {v4 as uuidv4} from 'uuid';
import { TInternalMessage, TMessageEnum, TUserMessage } from '../../types/chat';
import { useNavigation } from '@react-navigation/native';
import socket from '../../utils/socket';

export const CallWindow = ({
    config,
    finishCall,
    chat,
    nickname,
    setPeerNicknameFunc,
    startAudioCalling,
    chatStatus
}: CallWindowProps) => {
    const [newMessageText, setNewMessageText] = useState<string>('');
    const beepEndSoundRef = useRef<Sound>(null!);
    const [peerNickname, setPeerNickname] = useState<string>('');

    const [theme, setTheme] = useState<string>(Appearance.getColorScheme() || 'light');

    const { connection } = useContext(PeerConnectionContext);
    const navigation = useNavigation();

    connection?.mediaDevice.mute('Audio');
    useEffect(() => {
        // send internal message to hand over a nickname
        connection?.mediaDevice.mute('Audio');
        setTimeout(() => {
            console.log('User Nickname sended');
            connection?.sendMessage({ peerNickname: nickname, type: TMessageEnum.Internal } as TInternalMessage);   
        }, 5000)     
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
    }, []);

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
                        <View style={{ flexDirection: 'row', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ButtonIconBackward onPress={onHandleBackward}>
                                <Svg.Backward fill={theme === 'light' ? '#000' : '#fff'}/>
                            </ButtonIconBackward>
                            <Title>{peerNickname === '' ? 'Loading...' : peerNickname}</Title>
                        </View>
                        {chatStatus && <Text style={{color: theme === 'light' ? '#fff' : '#000'}}>{chatStatus}</Text>}
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
                                        <ButtonIconDisable
                                            onPress={() => {
                                                finishCall(true)
                                            }}>
                                            <Svg.PhoneDisable fill={'#fff'} width={13} height={13}/>
                                        </ButtonIconDisable>
                                        <ButtonIconCall onPress={() => {
                                            startAudioCalling();
                                        }}>
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

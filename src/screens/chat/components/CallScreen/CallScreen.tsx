import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, Vibration, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ButtonContainer, ButtonIcon, ButtonRow, Footer, Header, Row, Title } from './styled';
import { Svg } from '../../../../assets/icons';
import { CallScreenProps } from './types';
import { PeerConnectionContext } from '../../chat';
import { RTCView } from 'react-native-webrtc';

export const CallScreen = ({ peerNickname, onEndCall, remoteSrc, config }: CallScreenProps) => {
    const remoteVideo = useRef<any>();
    const localVideo = useRef<any>();
    const [audio, setAudio] = useState(config?.audio);
    const [isMuted, setIsMuted] = useState<boolean>(true);
    
    const { connection } = useContext(PeerConnectionContext);
    const mediaDevice = connection.mediaDevice;
    
    useEffect(() => {
        console.log('Call Screen!!')
        connection.mediaDevice.unmute('Audio');
        Vibration.vibrate([0.3, 0.3]);
    })

    useEffect(() => {
        if (remoteVideo.current && remoteSrc) {
            remoteVideo.current.srcObject = remoteSrc
        }
    }, [remoteSrc])
   
    useEffect(() => {
        isMuted
        ? connection.mediaDevice.unmute('Audio') 
        : connection.mediaDevice.mute('Audio');
    }, [isMuted]);

    const onMuteToggle = () => {
        setIsMuted(!isMuted);
    }

    return (
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            colors={['#6d6e70', '#383b42']}
            style={styles.linearGradient}>
        <RTCView streamURL={remoteSrc.toURL()} />
            
        <Header>
            <Row><Text style={{fontSize: 25, color: 'white'}}>Audicall</Text></Row>
            <Row><Title>{peerNickname}</Title></Row>
        </Header>

        <Footer>
            <ButtonRow style={{ flex: 1, bottom: 0, marginBottom: 50 }}>
                <ButtonIcon isRed onPress={onEndCall}>
                    {/* End */}
                    <Svg.PhoneDown fill={'white'} width={60} height={60}/>
                </ButtonIcon>

                <ButtonIcon isDark={isMuted} onPress={onMuteToggle}>
                    {/* Mute */}
                    <Svg.MicSlash fill={'white'} width={60} height={60}/>
                </ButtonIcon>
            </ButtonRow>
        </Footer>

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: "absolute",
    },
});
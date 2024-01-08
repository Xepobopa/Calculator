import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, Vibration, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ButtonContainer, ButtonIcon, Header, Row, Title } from './styled';
import { Svg } from '../../../../assets/icons';
import { CallScreenProps } from './types';
import { PeerConnectionContext } from '../../chat';

export const CallScreen = ({ peerNickname, onEndCall, mediaDevice, remoteSrc, config }: CallScreenProps) => {
    const remoteVideo = useRef<any>();
    const localVideo = useRef<any>();
    const [audio, setAudio] = useState(config?.audio);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    
    const { connection } = useContext(PeerConnectionContext);
    
    useEffect(() => {
        Vibration.vibrate([0.3, 0.3]);
    })

    useEffect(() => {
        if (remoteVideo.current && remoteSrc) {
            remoteVideo.current.srcObject = remoteSrc
        }
    }, [remoteSrc])

    useEffect(() => {
        if (mediaDevice) {
            mediaDevice.toggle('Audio', audio)
        }
    }, [mediaDevice]);

    const onMuteToggle = () => {
        setAudio(!audio)
        mediaDevice.toggle('Audio')
    }

    return (
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            colors={['#6d6e70', '#383b42']}
            style={styles.linearGradient}>
            
        <Header>
            <Row><Text style={{fontSize: 25, color: 'white'}}>Audicall</Text></Row>
            <Row><Title>{peerNickname}</Title></Row>
        </Header>

        <Row style={{ flex: 1, bottom: 0, marginBottom: 50 }}>
            <ButtonIcon isDark={isMuted} onPress={onMuteToggle}>
                {/* Mute */}
                <Svg.PhoneDown fill={'white'}/>
            </ButtonIcon>

            <ButtonIcon isRed onPress={onEndCall}>
                {/* End */}
                <Svg.PhoneDown fill={'white'}/>
            </ButtonIcon>
        </Row>

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
});
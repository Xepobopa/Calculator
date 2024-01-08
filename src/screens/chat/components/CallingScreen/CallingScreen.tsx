import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CallingScreenProps } from './types';
import LinearGradient from 'react-native-linear-gradient';
import { ButtonContainer, ButtonIcon, Header, Row, Title } from './styled';
import { Svg } from '../../../../assets/icons';

export const CallingScreen = ({ peerNickname, onReject, onSuccess }: CallingScreenProps) => {
    return (
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            colors={['#6d6e70', '#383b42']}
            style={styles.linearGradient}>
            
        <Header>
            <Row><Text style={{fontSize: 25, color: 'white'}}>Audicall</Text></Row>
            <Row><Title>{peerNickname}</Title></Row>
        </Header>


        <Row style={{ flex: 1, bottom: 0, marginBottom: 50 }}>
            <ButtonIcon isRed={true} onPress={onReject}>
                {/* REJECT */}
                <Svg.PhoneDown fill={'white'}/>
            </ButtonIcon>

            <ButtonIcon onPress={onSuccess}>
                {/* SUCCESS */}
                <Svg.PhoneArrowUp fill={'white'}/>
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
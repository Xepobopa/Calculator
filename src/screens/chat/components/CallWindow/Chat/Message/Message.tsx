import React from "react";
import { Text, View } from "react-native";
import { MessageProps } from "./types";
import { ThemeProvider } from "styled-components";
import { MessageText, MyMessage, OtherMessage } from "./style";

export const Message = ({ messageData, theme, nickname }: MessageProps) => {

    return (
        <ThemeProvider theme={{ main: theme }}>
            {
                messageData.from === nickname ?
                <MyMessage key={Math.random() * 1000}>
                    <MessageText messageType="my">{messageData.text}</MessageText>
                </MyMessage>
                :
                <OtherMessage key={Math.random() * 1000}>
                    <MessageText>{messageData.text}</MessageText>
                </OtherMessage>
            }
        </ThemeProvider>
    );
}
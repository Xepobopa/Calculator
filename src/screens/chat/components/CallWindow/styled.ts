import styled from "styled-components/native";
import {View, Text, TextInput, TouchableOpacity, ScrollView} from "react-native";

export const Window = styled.View<{ $theme: string }>`
  flex: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  background-color: ${props => props.$theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)'};
`

export const MainContainer = styled.View`
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
`

export const Header = styled.View`
  padding: 15px 0;
  padding-top: 35px;
  justify-content: center;
  align-items: center;
  background-color: rgba(40,46,51,255);
`

export const ButtonIcon = styled.TouchableOpacity`
  background-color: #0275d8;
  padding: 13px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px;
`
export const ButtonIconSend = styled(ButtonIcon)`
  background-color: #0275d8;
  padding: 8px;
  border-radius: 25px;
  position: 'fixed';
  align-self: 'center';
  right: 0;
`

export const ButtonIconDisable = styled(ButtonIcon)`
  background-color: #d9534f;
`

export const Title = styled(Text)`
  padding: 10px 5px;
  text-align: center;
  font-size: 27px;
`

export const StyledTextInput = styled.TextInput`
  flex: 1;
  color: ${props => (props.theme.main === 'light' ? 'black' : 'whitesmoke')};
  padding: 7px 15px;
  border: 1px solid #434343;
  margin-left: 5px;
  font-size: 18px;
  border-radius: 20px;
  background-color: ${props => (props.theme.main === 'light' ? 'whitesmoke' : 'black')};
`

export const RowContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export const ButtonContainer = styled(View)`
  right: 0;
  position: absolute;
  display: flex;
  flex-direction: row;
`

export const Footer = styled(View)`
  background-color: rgba(255, 255, 255, 0.05);
`

export const TextInputArea = styled(View)`
  padding-bottom: 20px
`

export const MessagesArea = styled(ScrollView)`
  margin: 0 10px;
  flex: 1
`
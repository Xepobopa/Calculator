import styled from "styled-components";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export const MainWindowView = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  text-align: center;
  flex-direction: column;
  padding: 40px;
  width: 300px;
  max-height: 400px
`

export const MainWindowLocalId = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  flex-direction: column;
  padding-bottom: 30px;
  font-size: 18px;
`

export const MainWindowLocalIdText = styled(Text)`
  font-size: 18px;
  color: black;
`

export const MainWindowTitle = styled(Text)`
  font-size: 25px;
  margin-bottom: 5px;
  font-weight: bold;
  color: black;
`
export const MainWindowRemoteId = styled(View)`
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: black;
`

export const MainWindowError = styled(Text)`
  color: #d9534f;
`

export const MainWindowTextInput = styled(TextInput)`
  margin: 6px 0;
  padding: 5px;
  text-align: center;
  font-size: 18px;
  color: black;
  border-bottom-color: black;
  border-bottom-width: 1px;
`

export const MainWindowButtonIcon = styled(TouchableOpacity)`
  background-color: #0275d8;
  padding: 13px;
  border-radius: 25px;
  margin-top: 10px;
  align-self: center;
  justify-self: center;
`

export const MainWindowButtonText = styled(MainWindowButtonIcon)`
  border-radius: 10px;
  padding: 7px 12px;
`
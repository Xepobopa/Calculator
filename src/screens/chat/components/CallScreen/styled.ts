import styled from "styled-components/native";

export const Title = styled.Text`
    color: white;
    font-size: 40px;
    font-weight: 700;
`

export const Row = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

export const ButtonRow = styled(Row)`
    flex: 1; 
    bottom: -100px;
    justify-content: space-between;
`

export const Footer = styled.View`
    flex: 1;
    bottom: -100px;
`

export const Header = styled.View`
    margin-top: 100px;
`

export const ButtonContainer = styled.View`
    flex: 1;
    bottom: 0;
    margin-bottom: 50px;
    display: table-column-group;
    justify-content: space-between;
`

export const ButtonIcon = styled.TouchableOpacity<{isRed?: boolean, isDark?: boolean}>`
  background-color: ${ props => props.isRed ? '#ff463a' : (props.isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)') };
  height: 90px;
  width: 90px;
  border-radius: 45px;
  padding-left: ${props => props.isRed ? 0 : 18}px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: ${props => props.isRed ? 32 : 0}px;
  margin: 0 25px;
`
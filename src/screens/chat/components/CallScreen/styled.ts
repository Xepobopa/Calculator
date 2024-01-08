import styled from "styled-components/native";

export const Title = styled.Text`
    color: white;
    font-size: large;
    font-weight: bold;
`

export const Row = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

export const Header = styled.View`
    margin-top: 100px;
`

export const ButtonContainer = styled.View`
    flex: 1;
    top: 0;
    margin-bottom: 50px;
    display: table-column-group;
`

export const ButtonIcon = styled.TouchableOpacity<{isRed?: boolean, isDark?: boolean}>`
  background-color: ${ props => props.isRed ? '#ff463a' : 'rgba(255, 255, 255, 0.25)' };
  background-color: ${ props => props.isDark ? '#ff463a' : 'rgba(0, 0, 0, 0.25)' };
  padding: 13px;
  border-radius: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px;
`
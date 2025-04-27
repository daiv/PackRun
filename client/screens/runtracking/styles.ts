import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: 1,
      position: 'relative',
      backgroundColor: '#222222'
    },
    screentext: {
        marginTop: 7,
        fontSize: 55,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Roboto',
    },
    stopbtn: {
        height: 100,
        width: 100,
        color: 'red',
    },
    stopbtntext: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'Roboto',
    }
});

export default styles;
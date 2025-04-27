import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: 1,
      position: 'relative'
    },
    topdash: {
        width: '100%',
        height: 50,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10
    },
    dashtext: {
        marginTop: 7,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Roboto',
    }
});

export default styles;
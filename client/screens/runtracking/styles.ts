import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: 1,
    position: 'relative',
    backgroundColor: '#222222'
  },
  startbtn: {
    width: 90,
    height: 90,
    position: 'absolute',
    bottom: 75,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
    backgroundColor: 'rgba(236, 97, 35, 0.88)',
    borderRadius: 16,
    marginBottom: 44,
  },
  startbtntext: {
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: 'bold',
  },
  screentext: {
    marginTop: 7,
    fontSize: 45,
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
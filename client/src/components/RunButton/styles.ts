import { StyleSheet } from "react-native";
export default StyleSheet.create({

  startbtn: {
    width: 90,
    height: 90,
    position: 'absolute',
    bottom: 70,
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

});
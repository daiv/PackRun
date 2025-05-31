import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  dashbutton: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: 50,
    height: 50,
    overflow: 'hidden',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  bottomdash: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 50,
    width: '100%',
    height: 180,
    backgroundColor: '#f8f8f8',
  },
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
  }
});

export default styles;
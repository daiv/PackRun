import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  /*   dashbutton: {
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
    }, */

  title: {
    fontSize: 24,
    marginBottom: 25,
    textAlign: 'center',
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
  /*   bottomdash: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingBottom: 50,
      width: '100%',
      height: 180,
      backgroundColor: '#f8f8f8',
    }, */
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

  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgray'
  },


  horButtons: {
    flexDirection: "row"
  },

  modalView: {
    flexDirection: 'row',
    width: '80%',
    height: '5%',
    backgroundColor: 'white',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 5,
  },
  modalTextInput: {
    flex: 4,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: 'white',
  },

  loading: {
    alignSelf: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    width: 70
  },

  button: {
    flex: 1,
    height: 50,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    padding: 1,
    textAlign: 'center',
  },

});

export default styles;
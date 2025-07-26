import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

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
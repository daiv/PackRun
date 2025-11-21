import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  loading: {
    alignSelf: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    width: 70
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgray'
  },
  title: {
    fontSize: 24,
    marginBottom: 25,
    textAlign: 'center',
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

  horButtons: {
    flexDirection: "row"
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
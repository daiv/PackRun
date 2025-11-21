import { StyleSheet } from "react-native";

export default StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 25,
    textAlign: 'center',
  },
  loading: {
    alignSelf: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    width: 70
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


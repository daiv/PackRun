import { StyleSheet } from "react-native";

export default StyleSheet.create({
  userText: {
    color: 'black',
    fontFamily: 'Roboto',
    fontSize: 14,
    alignSelf: 'flex-end',
    marginRight: 6
  },
  othersText: {
    color: 'black',
    fontFamily: 'Roboto',
    fontSize: 14,
    marginLeft: 6
  },
  userMessage: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginLeft: 4
  },

  othersMessage: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    marginLeft: 4
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
});
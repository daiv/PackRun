import { StyleSheet } from "react-native";

export default StyleSheet.create({
  messageBubble: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginRight: 4
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
  userMessage: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginLeft: 4
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  othersText: {
    color: 'black',
    // fontWeight: 'bold',
    fontFamily: 'Roboto',
    fontSize: 14,
    marginLeft: 6
  },
  userText: {
    color: 'black',
    // fontWeight: 'bold',
    fontFamily: 'Roboto',
    fontSize: 14,
    alignSelf: 'flex-end',
    marginRight: 6
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    position: 'relative',

  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  container: {
    flex: 1,
    width: '100%',
    position: 'relative',
    backgroundColor: '#ffp'
    
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
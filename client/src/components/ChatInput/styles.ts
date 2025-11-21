import { StyleSheet } from 'react-native';
export default StyleSheet.create({

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
  }
});
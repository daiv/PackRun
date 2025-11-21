import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 25,
    position: 'relative'
  },

  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 24,
  },

  listContainer: {
    flex: 1,
  },

  refresh: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    opacity: 0.8
  },

});
export default styles;
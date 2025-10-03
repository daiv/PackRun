import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loading: {
    alignSelf: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    width: 70
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
  },

  contentArea: {
    paddingHorizontal: 20,
    flex: 1,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },

  editableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    color: '#666',
    marginRight: 15,
    fontWeight: 'bold',
    minWidth: 80,
  },

  value: {
    fontSize: 18,
    color: '#333',
    flex: 1,
  },

  valueText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },

  editButton: {
    padding: 5,
    marginLeft: 10,
  },


  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 8,
    marginTop: 'auto',
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
  },

  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles; 
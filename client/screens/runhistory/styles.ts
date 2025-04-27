import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 25,
    position: 'relative'
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  listContainer: {
    flex: 1,
  },
  runCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 20,
    paddingBottom: 0,
    marginBottom: 20,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#4A90E2',
  },
  runHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  runProfile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  runDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  runTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'right',
  },
  runRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  runLabel: {
    fontSize: 14,
    color: '#777',
  },
  runValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  refresh: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    opacity: 0.8
  }
});
export default styles;
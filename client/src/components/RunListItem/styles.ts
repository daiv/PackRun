import { StyleSheet } from "react-native";
export default StyleSheet.create({

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

  runTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'right',
  },

  runDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
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

  runProfile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

});

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapcontainer: {
    // height: 660,
    height: '100%',
    width: '100%',
  },
  mapview: {
    flex: 1,
  },
  topdash: {
    height: 68,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingBottom: 10,
  },
  dashtext: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Roboto',
  },

});

export default styles;
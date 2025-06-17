import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreen: {
    // height: 660,
    height: '100%',
    width: '100%',
    justifyContent: 'center'
  },
  mapview: {
    flex: 1,
  },
  markerView: {
    flex: 1,
  },
  loading: {
    alignSelf: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    width: 70
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
  icon: {
    alignSelf: 'center',
    justifyContent: 'center'
  }
});

export default styles;
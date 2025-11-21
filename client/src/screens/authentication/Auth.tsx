import { useState } from "react";
import { View } from "react-native";
import { styles } from "./styles";
import CreateAccount from "client/src/components/CreateAccount/CreateAccount";
import Login from "client/src/components/Login/Login";


export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleLogin = () => setIsLogin(isLogin => !isLogin);

  return (
    <View style={styles.mainContainer}>
      <View style={{ width: '60%' }}>
        {isLogin ? <Login toggleLogin={toggleLogin} /> : <CreateAccount toggleLogin={toggleLogin} />}
      </View>
    </View>
  )
}
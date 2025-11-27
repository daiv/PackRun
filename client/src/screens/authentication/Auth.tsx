import { useState } from "react";
import { View } from "react-native";
import { styles } from "./styles";
import { Login } from "../../components/Login/Login";
import { CreateAccount } from "../../components/CreateAccount/CreateAccount";

export function Auth() {
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
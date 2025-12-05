import { useState } from "react";
import { View } from "react-native";
import { styles } from "./styles";
import { CreateAccount, Login } from "@components";

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleLogin = () => setIsLogin(isLogin => !isLogin);

  return (
    <View style={styles.mainContainer}>
      <View style={{ width: '60%' }}>
        {isLogin
          ?
          <Login toggleLogin={toggleLogin} />
          :
          <CreateAccount toggleLogin={toggleLogin} />}
      </View>
    </View>
  )
}
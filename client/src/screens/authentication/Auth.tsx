import CreateAccount from "../../components/CreateAccount";
import { useState } from "react";
import Login from "../../components/Login";
import { View } from "react-native";
import { styles } from "./styles";


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
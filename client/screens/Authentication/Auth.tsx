import { Text } from "react-native-svg";
import { AuthProps } from "../../helpers/Types";
import CreateAccount from "../../components/CreateAccount";
import { useState } from "react";
import Login from "../../components/Login";
import { View } from "react-native";
import { styles } from "./styles";


export default function Auth({ setIsLogged }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);

  const toggleLogin = () => setIsLogin(() => !isLogin);

  return (
    <View style={styles.mainContainer}>
      <View style={{ width: '60%' }}>

        {isLogin ? <Login toggleLogin={toggleLogin} setIsLogged={setIsLogged} /> : <CreateAccount toggleLogin={toggleLogin} />}

      </View>
    </View>
  )
}
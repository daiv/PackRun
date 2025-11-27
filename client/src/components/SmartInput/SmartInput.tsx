import React from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import { SmartInputProps } from "../../types/types";
import Ionicons from '@expo/vector-icons/Ionicons';

export const SmartInput = React.forwardRef<TextInput, SmartInputProps>((props, ref) => {

  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  const { errorMessage, placeholder, value, nextRef, onChangeText } = props;
  const isPassword = placeholder?.toLowerCase().includes('password');

  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
        <TextInput
          ref={ref}
          style={[{ flex: 6, minHeight: 30 }, errorMessage && { borderColor: 'red', borderWidth: 1 }]}
          placeholder={placeholder}
          onChangeText={onChangeText}
          returnKeyType={nextRef ? 'next' : 'done'}
          keyboardType={placeholder?.toLowerCase().includes('email') ? 'email-address' : 'default'}
          onSubmitEditing={nextRef ? () => nextRef.current?.focus() : undefined}
          secureTextEntry={isPassword && !isVisible}
          value={value}
        />
        {isPassword && <TouchableOpacity onPress={() => setIsVisible(!isVisible)} style={{ marginLeft: 10, flex: 1 }}>
          {isVisible
            ?
            <Ionicons name="eye" size={24} color="black" />
            :
            <Ionicons name="eye-off" size={24} color="black" />
          }
        </TouchableOpacity>}
      </View>
      {
        errorMessage && <Text style={{ color: 'red', marginBottom: 6 }}>{errorMessage}</Text>
      }
    </>
  )
});

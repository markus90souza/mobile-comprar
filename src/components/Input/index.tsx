
import { TextInput, TextInputProps } from "react-native";
import { styles } from "./styles";
import type { FC } from "react";

type InputProps = TextInputProps
const Input: FC<InputProps> = ({ ...rest }) => {
  return (
    <TextInput    
      style={styles.container}
      placeholderTextColor="#74798B"
      {...rest} 
    />
  )
}

export { Input }
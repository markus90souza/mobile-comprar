
import type { FC } from 'react';
import { Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { styles } from './styles';

// import { Container } from './styles';

type ButtonProps =  {
  title: string;
} & TouchableOpacityProps

const Button: FC<ButtonProps> = ({ title, ...rest}) => {
  return <TouchableOpacity style={styles.container} activeOpacity={0.7} {...rest}>
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
}

export { Button };
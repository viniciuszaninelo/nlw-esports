import { ImageBackground } from 'react-native';

import BackgroundImg from '../../assets/background-galaxy.png';

import { styles } from './styles'


interface Props {
  children: React.ReactNode
}

export function Background({ children }: Props) {
  return (
    <ImageBackground 
      source={BackgroundImg}
      defaultSource={BackgroundImg}
      style={styles.container}
    >
      { children }
    </ImageBackground>
  );
}
import { useFonts } from 'expo-font';
import { ReactNode } from 'react';

export default function WebFontsLoader({ children }: { children?: ReactNode }) {
  const [loaded, error] = useFonts({
    'Ubuntu-Regular': require('../../../assets/fonts/Ubuntu-Regular.ttf'),
    'Ubuntu-Italic': require('../../../assets/fonts/Ubuntu-Italic.ttf'),
    'Ubuntu-Medium': require('../../../assets/fonts/Ubuntu-Medium.ttf'),
    'Ubuntu-MediumItalic': require('../../../assets/fonts/Ubuntu-MediumItalic.ttf'),
    'Ubuntu-Bold': require('../../../assets/fonts/Ubuntu-Bold.ttf'),
    'Ubuntu-BoldItalic': require('../../../assets/fonts/Ubuntu-BoldItalic.ttf'),
  });

  return children
}

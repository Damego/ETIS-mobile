import type { SceneRendererProps } from 'react-native-tab-view';

// A copy of SceneProps
export type SceneProps = {
  route: {
    key: string;
    title: string;
  };
} & Omit<SceneRendererProps, 'layout'>;

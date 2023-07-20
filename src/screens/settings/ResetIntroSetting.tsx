import React from 'react';

import ClickableText from '../../components/ClickableText';
import { useAppDispatch, useGlobalStyles } from '../../hooks';
import { setIntroViewed } from '../../redux/reducers/settingsSlice';
import { fontSize } from '../../utils/texts';

const ResetIntroSetting = () => {
  const dispatch = useAppDispatch();
  const globalStyles = useGlobalStyles();

  return (
    <ClickableText
      text={'Сбросить обучение'}
      onPress={() => dispatch(setIntroViewed(false))}
      textStyle={[fontSize.medium, { fontWeight: '500' }, globalStyles.textColor]}
    />
  );
};

export default ResetIntroSetting;

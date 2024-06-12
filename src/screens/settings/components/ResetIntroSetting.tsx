import React from 'react';
import ClickableText from '~/components/ClickableText';
import { useAppDispatch } from '~/hooks';
import { setIntroViewed } from '~/redux/reducers/settingsSlice';
import { fontSize } from '~/utils/texts';

const ResetIntroSetting = () => {
  const dispatch = useAppDispatch();

  return (
    <ClickableText
      text={'Сбросить обучение'}
      onPress={() => dispatch(setIntroViewed(false))}
      textStyle={[fontSize.medium, { fontWeight: '500' }]}
      colorVariant={'block'}
    />
  );
};

export default ResetIntroSetting;

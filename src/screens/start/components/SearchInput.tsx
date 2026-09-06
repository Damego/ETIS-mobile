import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput, View } from 'react-native';

import { useGlobalStyles } from '~/hooks';

const SearchInput = ({
  value,
  onValueChange,
  autoCapitalize,
}: {
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly autoCapitalize?: boolean;
}) => {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();

  return (
    <View style={[styles.container, globalStyles.card]}>
      <AntDesign name={'search1'} size={20} color={globalStyles.textColor.color} />
      <TextInput
        autoCapitalize={autoCapitalize ? 'characters' : undefined}
        placeholder={t('common.search')}
        style={[styles.input, globalStyles.textColor]}
        value={value}
        placeholderTextColor={globalStyles.textColor2.color}
        onChangeText={onValueChange}
      />
    </View>
  );
};

export default React.memo(SearchInput);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '2%',
    paddingVertical: '2%',
    gap: 16,
  },
  input: {
    width: '100%',
  },
});

import { AntDesign } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isPsutechAvailable, searchTeachers } from '~/api/psutech/api';
import { ITeacherPSU } from '~/api/psutech/types';
import { cache } from '~/cache/smartCache';
import BorderLine from '~/components/BorderLine';
import ClickableText from '~/components/ClickableText';
import { LoadingContainer } from '~/components/LoadingScreen';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useAppDispatch, useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { setTeacher } from '~/redux/reducers/accountSlice';
import SearchInput from '~/screens/start/components/SearchInput';
import { fontSize } from '~/utils/texts';

const SelectTeacherScreen = () => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  const insets = useSafeAreaInsets();

  const dispatch = useAppDispatch();
  const [selectedTeacher, setSelectedTeacher] = useState<ITeacherPSU | null>(null);

  const [query, setQuery] = useState('');
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['teachers', query],
    queryFn: () => searchTeachers(query),
  });

  const handleTeacherSelect = (teacher: ITeacherPSU) => () => {
    setSelectedTeacher(teacher);
  };

  const handleConfirm = () => {
    if (selectedTeacher?.id && selectedTeacher?.name) {
      const teacher = { id: selectedTeacher.id, name: selectedTeacher.name };
      dispatch(setTeacher(teacher));
      cache.setTeacherData(teacher);
    }
  };

  return (
    <>
      <Screen onUpdate={refetch}>
        <View style={styles.searchWrapper}>
          <SearchInput value={query} onValueChange={setQuery} />
        </View>

        {isLoading && <LoadingContainer variant={'texts'} />}

        {!isLoading && isPsutechAvailable() === false && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={fontSize.medium} colorVariant={'text2'}>
              Сервис временно недоступен.{'\n'}Попробуйте позже.
            </Text>
          </View>
        )}

        {data?.map((teacher, index) => (
          <View key={teacher?.id || index}>
            <ClickableText
              onPress={handleTeacherSelect(teacher)}
              viewStyle={styles.teacherItem}
              textStyle={fontSize.medium}
              iconRight={
                teacher?.id === selectedTeacher?.id && (
                  <AntDesign name={'checkcircle'} color={theme.colors.primary} size={20} />
                )
              }
            >
              {teacher?.name || 'Неизвестный преподаватель'}
            </ClickableText>
            {index !== data.length - 1 && <BorderLine />}
          </View>
        ))}
      </Screen>

      {selectedTeacher !== null && (
        <TouchableOpacity
          onPress={handleConfirm}
          style={[
            styles.button,
            { bottom: Math.max(insets.bottom, 8) },
            globalStyles.primaryBackgroundColor,
            globalStyles.borderRadius,
          ]}
        >
          <Text colorVariant={'primaryContrast'} style={fontSize.big}>
            Выбрать
          </Text>
          <Text colorVariant={'primaryContrast'}>({selectedTeacher?.name || ''})</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default SelectTeacherScreen;

const styles = StyleSheet.create({
  searchWrapper: {
    marginVertical: '5%',
  },
  teacherItem: {
    paddingVertical: '4%',
    justifyContent: 'space-between',
  },
  button: {
    position: 'absolute',
    left: 0,
    right: 0,
    padding: '4%',
    alignItems: 'center',
    marginHorizontal: '4%',
  },
});

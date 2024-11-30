import { AntDesign } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { searchTeachers } from '~/api/psutech/api';
import { ITeacher } from '~/api/psutech/types';
import SearchInput from '~/app/(start)/components/SearchInput';
import { cache } from '~/cache/smartCache';
import BorderLine from '~/components/BorderLine';
import ClickableText from '~/components/ClickableText';
import { LoadingContainer } from '~/components/LoadingScreen';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useAppDispatch, useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { setTeacher } from '~/redux/reducers/accountSlice';
import { fontSize } from '~/utils/texts';
import { useRouter } from 'expo-router';

const SelectTeacherScreen = () => {
  const router = useRouter()
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();

  const dispatch = useAppDispatch();
  const [selectedTeacher, setSelectedTeacher] = useState<ITeacher>(null);

  const [query, setQuery] = useState('');
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['teachers', query],
    queryFn: () => searchTeachers(query),
  });

  const handleTeacherSelect = (teacher: ITeacher) => () => {
    setSelectedTeacher(teacher);
  };

  const handleConfirm = () => {
    const teacher = { id: selectedTeacher.id, name: selectedTeacher.name };
    dispatch(setTeacher(teacher));
    cache.setTeacherData(teacher);
    // router.push('(teacher)/timetable')
  };

  return (
    <>
      <Screen onUpdate={refetch}>
        <View style={styles.searchWrapper}>
          <SearchInput value={query} onValueChange={setQuery} />
        </View>

        {isLoading && <LoadingContainer variant={'texts'} />}

        {data?.map((teacher, index) => (
          <View key={teacher.id}>
            <ClickableText
              onPress={handleTeacherSelect(teacher)}
              viewStyle={styles.teacherItem}
              textStyle={fontSize.medium}
              iconRight={
                teacher.id === selectedTeacher?.id && (
                  <AntDesign name={'checkcircle'} color={theme.colors.primary} size={20} />
                )
              }
            >
              {teacher.name}
            </ClickableText>
            {index !== data.length - 1 && <BorderLine />}
          </View>
        ))}
      </Screen>

      {selectedTeacher !== null && (
        <TouchableOpacity
          onPress={handleConfirm}
          style={[styles.button, globalStyles.primaryBackgroundColor, globalStyles.borderRadius]}
        >
          <Text colorVariant={'primaryContrast'} style={fontSize.big}>
            Выбрать
          </Text>
          <Text colorVariant={'primaryContrast'}>({selectedTeacher.name})</Text>
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
    bottom: '2%',
    left: 0,
    right: 0,
    padding: '4%',
    alignItems: 'center',
    marginHorizontal: '4%',
  },
});

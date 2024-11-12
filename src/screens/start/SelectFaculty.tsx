import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { getFaculties } from '~/api/psutech/api';
import { IFaculty } from '~/api/psutech/types';
import BorderLine from '~/components/BorderLine';
import LoadingScreen from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { StartStackScreenProps } from '~/navigation/types';
import { fontSize } from '~/utils/texts';

const FacultyButton = React.memo(
  ({
    faculty,
    onPress,
    isSelected,
  }: {
    faculty: IFaculty;
    onPress: (faculty: IFaculty) => void;
    isSelected: boolean;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => onPress(faculty)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
      >
        <Image
          source={faculty.logo_image_url}
          style={{ height: 50, width: 50, borderRadius: 25 }}
        />
        <Text style={[{ flex: 1 }, fontSize.big]} colorVariant={isSelected && 'primary'}>
          {faculty.name}
        </Text>
      </TouchableOpacity>
    );
  }
);

const SelectFacultyScreen = ({ navigation }: StartStackScreenProps) => {
  const globalStyles = useGlobalStyles();
  const [selectedFaculty, setSelectedFaculty] = useState<IFaculty>(null);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['faculties'],
    queryFn: getFaculties,
  });

  const handleConfirm = () => {
    navigation.navigate('SelectGroup', { facultyId: selectedFaculty.id });
  };

  if (isLoading) return <LoadingScreen variant={'texts'} />;
  if (!data) return <NoData onRefresh={refetch} />;

  return (
    <>
      <Screen containerStyle={{ gap: 8, paddingBottom: '30%' }}>
        {data.map((faculty, index) => (
          <View style={{ gap: 8 }} key={faculty.id}>
            <FacultyButton
              faculty={faculty}
              onPress={setSelectedFaculty}
              isSelected={faculty.id === selectedFaculty?.id}
            />
            {index !== data.length - 1 && <BorderLine />}
          </View>
        ))}
      </Screen>
      {selectedFaculty && (
        <TouchableOpacity
          onPress={handleConfirm}
          style={[styles.button, globalStyles.primaryBackgroundColor, globalStyles.borderRadius]}
        >
          <Text colorVariant={'primaryContrast'} style={fontSize.big}>
            Продолжить
          </Text>
          <Text colorVariant={'primaryContrast'}>({selectedFaculty.name})</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default SelectFacultyScreen;

const styles = StyleSheet.create({
  screenContainer: {
    marginHorizontal: '4%',
    flex: 1,
  },
  searchWrapper: {
    marginVertical: '5%',
  },
  teacherItem: {
    paddingVertical: '4%',
    justifyContent: 'space-between',
  },
  button: {
    marginHorizontal: '4%',
    position: 'absolute',
    bottom: '2%',
    left: 0,
    right: 0,
    padding: '4%',
    alignItems: 'center',
  },
});

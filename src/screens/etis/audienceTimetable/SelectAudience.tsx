import { AntDesign } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { searchAudience } from '~/api/psutech/api';
import BorderLine from '~/components/BorderLine';
import ClickableText from '~/components/ClickableText';
import { LoadingContainer } from '~/components/LoadingScreen';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { IAudience } from '~/models/timeTable';
import { EducationStackScreenProps } from '~/navigation/types';
import SearchInput from '~/screens/start/components/SearchInput';
import { fontSize } from '~/utils/texts';

const SelectAudience = ({ navigation }: EducationStackScreenProps) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();

  const [query, setQuery] = React.useState('');
  const [selectedAudience, setSelectedAudience] = React.useState<IAudience>(null);
  const [selectedBuilding, setSelectedBuilding] = React.useState(null);

  const { data, isLoading } = useQuery({
    queryFn: () => searchAudience(query, selectedBuilding),
    queryKey: ['aud-search', query, selectedBuilding],
  });

  const selectAudience = (audience: IAudience) => () => {
    setSelectedAudience(audience);
  };

  const handleConfirm = () => {
    navigation.navigate('AudienceTimetable', { audience: selectedAudience });
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.searchWrapper}>
        <SearchInput value={query} onValueChange={setQuery} />
      </View>

      {isLoading && <LoadingContainer />}

      {data?.map((audience, index) => (
        <View key={audience.id}>
          <ClickableText
            onPress={selectAudience(audience)}
            viewStyle={styles.teacherItem}
            textStyle={fontSize.medium}
            iconRight={
              audience.id === selectedAudience?.id && (
                <AntDesign name={'checkcircle'} color={theme.colors.primary} size={20} />
              )
            }
          >
            {audience.number}
          </ClickableText>
          {index !== data.length - 1 && <BorderLine />}
        </View>
      ))}

      {selectedAudience !== null && (
        <TouchableOpacity
          onPress={handleConfirm}
          style={[styles.button, globalStyles.primaryBackgroundColor, globalStyles.borderRadius]}
        >
          <Text colorVariant={'primaryContrast'} style={fontSize.big}>
            Выбрать
          </Text>
          <Text colorVariant={'primaryContrast'}>({selectedAudience.number})</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SelectAudience;

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
    position: 'absolute',
    bottom: '2%',
    left: 0,
    right: 0,
    padding: '4%',
    alignItems: 'center',
  },
});

import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isPsutechAvailable, searchGroups } from '~/api/psutech/api';
import { IGroup } from '~/api/psutech/types';
import { cache } from '~/cache/smartCache';
import BorderLine from '~/components/BorderLine';
import ClickableText from '~/components/ClickableText';
import { LoadingContainer } from '~/components/LoadingScreen';
import { ListScreen } from '~/components/Screen';
import Text from '~/components/Text';
import { useAppDispatch, useGlobalStyles } from '~/hooks';
import { StartStackScreenProps } from '~/navigation/types';
import { setStudent } from '~/redux/reducers/accountSlice';
import SearchInput from '~/screens/start/components/SearchInput';
import { fontSize } from '~/utils/texts';

const GroupItem = React.memo(
  ({
    group,
    isSelected,
    onPress,
  }: {
    readonly group: IGroup;
    readonly isSelected: boolean;
    readonly onPress: (group: IGroup) => void;
  }) => {
    const { t } = useTranslation();

    const formatDegree = (degree: string) =>
      ({
        НБ: t('start.degree.bachelor'),
        НМ: t('start.degree.master'),
        СП: t('start.degree.specialty'),
        АС: t('start.degree.postgraduate'),
      })[degree];

    return (
      <ClickableText
        textStyle={[{ fontWeight: 'bold' }, fontSize.big]}
        viewStyle={{ paddingVertical: '2%' }}
        bottomComponent={formatDegree(group.degree) && <Text>{formatDegree(group.degree)}</Text>}
        colorVariant={isSelected ? 'primary' : 'text'}
        onPress={() => onPress(group)}
      >
        {group.name.short}-{group.year}
      </ClickableText>
    );
  }
);

const SelectGroupScreen = ({ route }: StartStackScreenProps<'SelectGroup'>) => {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { facultyId } = route.params;
  const [selectedGroup, setSelectedGroup] = useState<IGroup | null>(null);
  const [query, setQuery] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['groups', query],
    queryFn: () => searchGroups(query, facultyId),
  });

  const handleGroupPress = (group: IGroup) => {
    setSelectedGroup(group);
  };
  const handleConfirm = () => {
    if (!selectedGroup) return;
    cache.setStudentData({ group: selectedGroup });
    dispatch(setStudent({ group: selectedGroup }));
  };

  const processValue = (value: string) => {
    setQuery(value.replaceAll(' ', '-'));
  };

  return (
    <>
      <View style={{ marginHorizontal: '4%' }}>
        <SearchInput autoCapitalize value={query} onValueChange={processValue} />
      </View>

      {isLoading ? <View style={{ flex: 1, marginHorizontal: '4%' }}>
        {isLoading ? <LoadingContainer variant={'texts'} /> : null}
      </View> : null}

      {!isLoading && isPsutechAvailable() === false && (
        <View style={{
          flex: 1, marginHorizontal: '4%', justifyContent: 'center', alignItems: 'center'
        }}>
          <Text style={fontSize.medium} colorVariant={'text2'}>
            {t('common.serviceUnavailable')}
          </Text>
        </View>
      )}

      <ListScreen
        renderItem={({ item }) => (
          <GroupItem
            group={item}
            isSelected={item.id === selectedGroup?.id}
            onPress={handleGroupPress}
          />
        )}
        keyExtractor={(item) => item.id}
        data={data ?? []}
        extraData={selectedGroup}
        ItemSeparatorComponent={() => <BorderLine />}
      />
      {selectedGroup ? <TouchableOpacity
        style={[
          styles.button,
          { bottom: Math.max(insets.bottom, 8) },
          globalStyles.primaryBackgroundColor,
          globalStyles.borderRadius,
        ]}
        onPress={handleConfirm}
      >
        <Text colorVariant={'primaryContrast'} style={fontSize.big}>
          {t('common.continue')}
        </Text>
        <Text colorVariant={'primaryContrast'}>({selectedGroup.name.full})</Text>
      </TouchableOpacity> : null}
    </>
  );
};

export default SelectGroupScreen;

const styles = StyleSheet.create({
  button: {
    marginHorizontal: '4%',
    position: 'absolute',
    left: 0,
    right: 0,
    padding: '4%',
    alignItems: 'center',
  },
});

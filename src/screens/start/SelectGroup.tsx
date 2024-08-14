import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { searchGroups } from '~/api/psutech/api';
import { IGroup } from '~/api/psutech/types';
import { cache } from '~/cache/smartCache';
import BorderLine from '~/components/BorderLine';
import ClickableText from '~/components/ClickableText';
import { ListScreen } from '~/components/Screen';
import Text from '~/components/Text';
import { useAppDispatch, useGlobalStyles } from '~/hooks';
import { StartStackScreenProps } from '~/navigation/types';
import { setStudent } from '~/redux/reducers/accountSlice';
import SearchInput from '~/screens/start/components/SearchInput';
import { fontSize } from '~/utils/texts';

const formatDegree = (degree: string) =>
  ({
    НБ: 'Бакалавриат',
    НМ: 'Магистратура',
    СП: 'Специалитет',
    АС: 'Аспирантура',
  })[degree];

const GroupItem = React.memo(
  ({
    group,
    isSelected,
    onPress,
  }: {
    group: IGroup;
    isSelected: boolean;
    onPress: (group: IGroup) => void;
  }) => {
    return (
      <ClickableText
        onPress={() => onPress(group)}
        textStyle={[{ fontWeight: 'bold' }, fontSize.big]}
        viewStyle={{ paddingVertical: '2%' }}
        bottomComponent={formatDegree(group.degree) && <Text>{formatDegree(group.degree)}</Text>}
        colorVariant={isSelected ? 'primary' : 'text'}
      >
        {group.name.short}-{group.year}
      </ClickableText>
    );
  }
);

const SelectGroupScreen = ({ route }: StartStackScreenProps<'SelectGroup'>) => {
  const globalStyles = useGlobalStyles();
  const dispatch = useAppDispatch();
  const { facultyId } = route.params;
  const [selectedGroup, setSelectedGroup] = useState<IGroup>(null);
  const [query, setQuery] = useState('');
  const { data } = useQuery({
    queryKey: ['groups', query],
    queryFn: () => searchGroups(query, facultyId),
  });

  const handleGroupPress = (group: IGroup) => {
    setSelectedGroup(group);
  };
  const handleConfirm = () => {
    cache.setStudentData({ group: selectedGroup });
    dispatch(setStudent({ group: selectedGroup }));
  };

  return (
    <>
      <View style={{ marginHorizontal: '4%' }}>
        <SearchInput value={query} onValueChange={setQuery} />
      </View>
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
        estimatedItemSize={66}
      />
      {selectedGroup && (
        <TouchableOpacity
          onPress={handleConfirm}
          style={[styles.button, globalStyles.primaryBackgroundColor, globalStyles.borderRadius]}
        >
          <Text colorVariant={'primaryContrast'} style={fontSize.big}>
            Продолжить
          </Text>
          <Text colorVariant={'primaryContrast'}>({selectedGroup.name.full})</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default SelectGroupScreen;

const styles = StyleSheet.create({
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

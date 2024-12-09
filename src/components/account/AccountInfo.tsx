import React from 'react';
import { View } from 'react-native';
import Text from '~/components/Text';
import { useAppSelector } from '~/hooks';
import { AccountType } from '~/redux/reducers/accountSlice';
import { fontSize } from '~/utils/texts';

const AccountInfo = () => {
  const { student, teacher, accountType } = useAppSelector((state) => state.account);

  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={[fontSize.large, { fontWeight: 'bold' }]}>
        {accountType === AccountType.UNAUTHORIZED_STUDENT ? student.group.name.full : teacher.name}
      </Text>
      <Text>{accountType === AccountType.UNAUTHORIZED_STUDENT ? 'Студент' : 'Преподаватель'}</Text>
    </View>
  );
};

export default AccountInfo;

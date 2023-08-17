import React from 'react';
import { Text, TextInput, View } from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { fontSize } from '../../utils/texts';
import { styles } from '../auth/AuthForm';

export default function TeacherQuestionView({
  teacher,
  setTeacher,
}: {
  teacher?: string;
  setTeacher(teacher: string): void;
}) {
  const globalStyles = useGlobalStyles();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={[fontSize.large, globalStyles.textColor]}>{teacher}</Text>
      <Text style={[fontSize.small, globalStyles.textColor, {marginVertical: '2%'}]}>
        Если же был другой преподаватель,{'\n'}то введите его
      </Text>
      <TextInput
        style={[globalStyles.textColor, globalStyles.border, globalStyles.block, { width: '80%', paddingVertical: '2%', paddingHorizontal: '2%' }]}
        onChangeText={setTeacher}
        placeholder="Иванов И.И."
        placeholderTextColor={globalStyles.textColor.color}
        autoComplete="name"
        inputMode="text"
        keyboardType="default"
        selectionColor="#C62E3E"
        autoCapitalize="words"
      />
    </View>
  );
}

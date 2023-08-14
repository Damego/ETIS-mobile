import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from '../auth/AuthForm';
import { useGlobalStyles } from '../../hooks';

export default function TeacherQuestionView({
  teacher,
  setTeacher,
}: {
  teacher?: string;
  setTeacher(teacher: string): void;
}) {
  const globalStyles = useGlobalStyles();
  return (
    <View>
      <Text>{teacher}</Text>
      <Text>Если же был другой преподаватель, то введите его</Text>
      <TextInput
        style={[globalStyles.textColor]}
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

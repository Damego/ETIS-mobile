import React from 'react';
import { TextInput, View } from 'react-native';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { fontSize } from '~/utils/texts';

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
      <Text style={fontSize.large}>{teacher}</Text>
      <Text style={[fontSize.small, { marginVertical: '2%' }]}>
        Если же был другой преподаватель,{'\n'}то введите его
      </Text>
      <TextInput
        style={[
          globalStyles.fontColorForBlock,
          globalStyles.border,
          globalStyles.block,
          { width: '80%', paddingVertical: '2%', paddingHorizontal: '2%' },
        ]}
        onChangeText={setTeacher}
        placeholder="Иванов И.И."
        placeholderTextColor={globalStyles.inputPlaceholder.color}
        autoComplete="name"
        inputMode="text"
        keyboardType="default"
        selectionColor={globalStyles.primaryText.color}
        autoCapitalize="words"
      />
    </View>
  );
}

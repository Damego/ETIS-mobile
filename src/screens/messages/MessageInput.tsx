import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { selectFile } from '../../utils';
import { fontSize } from '../../utils/texts';

const styles = StyleSheet.create({
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    padding: '2%',
  },
  iconView: {
    margin: '2%',
  },
  fileContainer: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 6,
    marginBottom: '3%',
    marginHorizontal: 4,
    paddingHorizontal: 5,
    paddingVertical: 5,
    alignItems: 'center',
    borderWidth: 1,
  },
  fileText: {
    ...fontSize.small,
    alignSelf: 'flex-end',
    fontWeight: '500',
  },
  wrapperContainer: {},
  scrollContainer: {},
  innerScrollContainer: {},
  removeIcon: {
    marginHorizontal: 5,
  },
});

const File = ({ name, onRemove }) => {
  const globalStyles = useGlobalStyles();
  const fileFormat = name.split('.').at(-1);
  const cutFileName = name.length < 14 ? name : `${name.substring(0, 10)}....${fileFormat}`;

  return (
    <View
      style={[
        styles.fileContainer,
        globalStyles.block,
        { borderColor: globalStyles.border.borderColor },
      ]}
    >
      <Text style={[styles.fileText, globalStyles.textColor]}>{cutFileName}</Text>
      <TouchableOpacity style={styles.removeIcon} onPress={() => onRemove(name)}>
        <AntDesign name="closecircleo" size={20} color={globalStyles.textColor.color} />
      </TouchableOpacity>
    </View>
  );
};

export const FilesPreview = ({ files, onFileRemove }) => (
  <View style={styles.wrapperContainer}>
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.innerScrollContainer}
      horizontal
    >
      {files.map(({ name }, index) => (
        <File name={name} onRemove={onFileRemove} key={`${name}-${index}`} />
      ))}
    </ScrollView>
  </View>
);

const MessageInput = ({ onFileSelect, onSubmit, showLoading }) => {
  const globalStyles = useGlobalStyles();
  const theme = useTheme();
  const [value, setValue] = useState<string>('');

  const innerSelectFile = async () => {
    const fileResult = await selectFile();
    if (fileResult) onFileSelect(fileResult);
  };

  const submit = () => {
    onSubmit(value);
    setValue('');
  };

  return (
    <View
      style={[
        styles.inputView,
        globalStyles.block,
        { borderColor: globalStyles.border.borderColor },
      ]}
    >
      <TouchableOpacity style={styles.iconView} onPress={innerSelectFile}>
        <Feather name="paperclip" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <TextInput
        style={[fontSize.medium, styles.input, globalStyles.textColor, globalStyles.block]}
        onChangeText={(text) => setValue(text)}
        value={value}
        placeholder="Сообщение"
        multiline
        selectionColor="#C62E3E"
        placeholderTextColor={globalStyles.textColor.color}
      />

      <TouchableOpacity disabled={!value || showLoading} style={styles.iconView} onPress={submit}>
        {showLoading ? (
          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
            style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
          />
        ) : (
          <Ionicons
            name="send"
            size={24}
            color={value ? theme.colors.primary : theme.colors.text}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;

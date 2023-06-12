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

const styles = StyleSheet.create({
  inputView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderTopColor: '#d3d3d3',
    borderTopWidth: 1,
  },
  input: {
    color: '#000',
    flex: 1,
    padding: '2%',
    fontSize: 16,
  },
  iconView: {
    margin: '2%',
  },
  fileContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    marginBottom: 5,
    marginHorizontal: 1,
    height: 30,
    paddingHorizontal: 5,
    paddingTop: 5,
  },
  fileText: {
    alignSelf: 'flex-end',
    fontSize: 14,
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
    <View style={[styles.fileContainer, globalStyles.shadow]}>
      <Text style={styles.fileText}>{cutFileName}</Text>
      <TouchableOpacity style={styles.removeIcon} onPress={() => onRemove(name)}>
        <AntDesign name="closecircleo" size={20} color="black" />
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
    <View style={styles.inputView}>
      <TouchableOpacity style={styles.iconView} onPress={innerSelectFile}>
        <Feather name="paperclip" size={24} color="black" />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        onChangeText={(text) => setValue(text)}
        value={value}
        placeholder="Сообщение"
        multiline
        selectionColor="#C62E3E"
      />

      <TouchableOpacity disabled={!value || showLoading} style={styles.iconView} onPress={submit}>
        {showLoading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <Ionicons
            name="send"
            size={24}
            color={value ? theme.colors.primary : theme.colors.border}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;

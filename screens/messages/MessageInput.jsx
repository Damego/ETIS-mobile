import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { selectFile } from '../../utils/files';

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
});

const MessageInput = ({ onChangeText, value, onFileSelect, onSubmit }) => {
  const innerSelectFile = async () => {
    const fileResult = await selectFile();
    if (fileResult) onFileSelect(fileResult);
  };

  return (
    <View style={styles.inputView}>
      <TouchableOpacity style={styles.iconView} onPress={innerSelectFile}>
        <Feather name="paperclip" size={24} color="black" />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={value}
        placeholder="Сообщение"
        multiline
        selectionColor="#C62E3E"
      />

      <TouchableOpacity style={styles.iconView} onPress={onSubmit}>
        <Ionicons name="send" size={24} color="#C62E3E" />
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;

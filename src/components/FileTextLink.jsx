import { shareAsync } from 'expo-sharing';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { downloadFile, saveFile } from '../utils';

const defaultStyle = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    color: '#427ADE',
  },
});

const FileTextLink = ({ src, fileName, style, children }) => {
  const downloadAndSave = async () => {
    const fileData = await downloadFile(src, fileName);

    try {
      await saveFile(fileData, fileName);
      throw "test";
    } catch (e) {
      console.log(e);
      console.trace();
    }
    await shareAsync(fileData.uri);
  };

  return (
    <TouchableOpacity onPress={downloadAndSave}>
      <Text style={[defaultStyle.text, style]}>{children}</Text>
    </TouchableOpacity>
  );
};

export default FileTextLink;

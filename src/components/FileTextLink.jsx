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
    await saveFile(fileData, fileName);
  };

  return (
    <TouchableOpacity onPress={downloadAndSave}>
      <Text style={[defaultStyle.text, style]}>{children}</Text>
    </TouchableOpacity>
  );
};

export default FileTextLink;

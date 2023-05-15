import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GLOBAL_STYLES } from '../../styles/styles';

const styles = StyleSheet.create({
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
  const fileFormat = name.split('.').at(-1);
  const cutFileName = name.length < 14 ? name : `${name.substring(0, 10)}....${fileFormat}`;

  return (
    <View style={[styles.fileContainer, GLOBAL_STYLES.shadow]}>
      <Text style={styles.fileText}>{cutFileName}</Text>
      <TouchableOpacity style={styles.removeIcon} onPress={() => onRemove(name)}>
        <AntDesign name="closecircleo" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const MessageFiles = ({ files, onFileRemove }) => (
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

export default MessageFiles;

import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  fileContainer: {
    flexDirection: 'row',
  },
  fileText: {},
  scrollContainer: {},
});

const File = ({ name, onRemove }) => (
  <View style={styles.fileContainer}>
    <Text>{name}</Text>
    <TouchableOpacity onPress={onRemove(name)}>
      <AntDesign name="closecircleo" size={6} color="black" />
    </TouchableOpacity>
  </View>
);

const MessageFiles = ({ files, onFileRemove }) => (
  <ScrollView horizontal>
    {files.map(({ name }) => (
      <File name={name} onRemove={onFileRemove} key={name} />
    ))}
  </ScrollView>
);

export default MessageFiles;

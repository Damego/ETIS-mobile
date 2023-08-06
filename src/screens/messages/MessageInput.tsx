import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { getDocumentAsync, DocumentPickerAsset } from 'expo-document-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { UploadFile } from '../../models/other';
import { Response } from '../../utils/http';
import { fontSize } from '../../utils/texts';

const styles = StyleSheet.create({
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: '2%',
    height: 50,
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
      <Text style={[styles.fileText, fontSize.small, globalStyles.textColor]}>{cutFileName}</Text>
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

const MessageInput = ({
  onFileSelect,
  onSubmit,
  showLoading,
}: {
  onFileSelect(file: UploadFile): void;
  onSubmit(text: string): Promise<Response<string>>;
  showLoading: boolean;
}) => {
  const globalStyles = useGlobalStyles();
  const theme = useTheme();
  const [value, setValue] = useState<string>('');

  const innerSelectFile = async () => {
    const result = await getDocumentAsync();

    if (!result) {
      ToastAndroid.show('Невозможно выбрать файл!', ToastAndroid.SHORT);
      return;
    }

    if (result.type === 'cancel') {
      return;
    }

    if (result.size > 2 * 1024 * 1024) {
      ToastAndroid.show('Файл должен быть не более 2 МБ!', ToastAndroid.SHORT);
      return;
    }

    const file = {
      name: result.name,
      type: result.mimeType,
      uri: result.uri,
    };

    onFileSelect(file);
  };

  const submit = async () => {
    const res = await onSubmit(value);
    if (!res || !res.error) {
      setValue('');
    }
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

      <TouchableOpacity
        disabled={!value.trim() || showLoading}
        style={styles.iconView}
        onPress={submit}
      >
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

import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { getDocumentAsync } from 'expo-document-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';

import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { UploadFile } from '~/models/other';
import { Response } from '~/utils/http';
import { fontSize } from '~/utils/texts';

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
    ...fontSize.small,
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
      <Text style={styles.fileText} colorVariant={'block'}>
        {cutFileName}
      </Text>
      <TouchableOpacity style={styles.removeIcon} onPress={() => onRemove(name)}>
        <AntDesign name="closecircleo" size={20} color={globalStyles.fontColorForBlock.color} />
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
  disabled,
}: {
  onFileSelect(file: UploadFile[]): void;
  onSubmit(text: string): Promise<Response<string>>;
  showLoading: boolean;
  disabled: boolean;
}) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const [value, setValue] = useState<string>('');

  const innerSelectFile = async () => {
    const result = await getDocumentAsync();

    if (!result) {
      ToastAndroid.show('Невозможно выбрать файл!', ToastAndroid.SHORT);
      return;
    }

    if (result.canceled === true) {
      return;
    }

    const docs = result.assets
      .map((doc) => {
        if (doc.size > 2 * 1024 * 1024) {
          ToastAndroid.show('Файл должен быть не более 2 МБ!', ToastAndroid.SHORT);
          return;
        }
        return {
          name: doc.name,
          type: doc.mimeType,
          uri: doc.uri,
        };
      })
      .filter((s) => !!s);
    onFileSelect(docs);
  };

  const submit = async () => {
    const res = await onSubmit(value);
    if (!res || !res.error) {
      setValue('');
    }
  };

  return (
    <View style={[styles.inputView, globalStyles.block, { borderColor: theme.colors.border }]}>
      <TouchableOpacity style={styles.iconView} onPress={innerSelectFile}>
        <Feather name="paperclip" size={24} color={theme.colors.textForBlock} />
      </TouchableOpacity>

      <TextInput
        style={[fontSize.medium, styles.input, globalStyles.fontColorForBlock, globalStyles.block]}
        onChangeText={(text) => setValue(text)}
        value={value}
        placeholder="Сообщение"
        multiline
        selectionColor={globalStyles.primaryFontColor.color}
        placeholderTextColor={theme.colors.inputPlaceholder}
        editable={!disabled}
      />

      <TouchableOpacity
        disabled={disabled && (!value.trim() || showLoading)}
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
            color={value ? theme.colors.primary : theme.colors.textForBlock}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;

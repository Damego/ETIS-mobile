import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getDocumentAsync } from 'expo-document-picker';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const MAX_FILE_SIZE_LIMIT = 2 * 1024 * 1024;

const File = ({ name, onRemove }: { readonly name: string; readonly onRemove: (name: string) => void }) => {
  const globalStyles = useGlobalStyles();
  const fileFormat = name.split('.').at(-1);
  const cutFileName = name.length < 14 ? name : `${name.substring(0, 10)}....${fileFormat}`;

  return (
    <View style={[styles.fileContainer, { borderColor: globalStyles.border.borderColor }]}>
      <Text style={styles.fileText}>{cutFileName}</Text>
      <TouchableOpacity style={styles.removeIcon} onPress={() => onRemove(name)}>
        <AntDesign name='closecircleo' size={20} color={globalStyles.textColor2.color} />
      </TouchableOpacity>
    </View>
  );
};

export const FilesPreview = ({
  files,
  onFileRemove,
}: {
  readonly files: UploadFile[];
  readonly onFileRemove: (fileName: string) => void;
}) => (
  <View style={styles.wrapperContainer}>
    <ScrollView
      horizontal
      style={styles.scrollContainer}
      contentContainerStyle={styles.innerScrollContainer}
    >
      {files.map(({ name }, index: number) => (
        <File key={`${name}-${index}`} name={name} onRemove={onFileRemove} />
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
  onSubmit(text: string): Promise<Response<string> | undefined>;
  readonly showLoading: boolean;
  readonly disabled: boolean;
}) => {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const [value, setValue] = useState<string>('');

  const innerSelectFile = async () => {
    const result = await getDocumentAsync();

    if (!result) {
      ToastAndroid.show(t('messages.fileSelectFailed'), ToastAndroid.SHORT);
      return;
    }

    if (result.canceled === true) {
      return;
    }

    const docs = result.assets
      .map((doc) => {
        if ((doc.size ?? 0) > MAX_FILE_SIZE_LIMIT) {
          ToastAndroid.show(t('messages.fileTooLarge'), ToastAndroid.SHORT);
          return;
        }
        return {
          name: doc.name,
          type: doc.mimeType ?? 'application/octet-stream',
          uri: doc.uri,
        };
      })
      .filter((s): s is UploadFile => Boolean(s));
    onFileSelect(docs);
  };

  const submit = async () => {
    const res = await onSubmit(value);
    if (!res?.error) {
      setValue('');
    }
  };

  return (
    <View style={[styles.inputView, { borderColor: theme.colors.border }]}>
      <TouchableOpacity style={styles.iconView} onPress={innerSelectFile}>
        <Feather name='paperclip' size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <TextInput
        multiline
        style={[fontSize.medium, styles.input, globalStyles.textColor]}
        value={value}
        placeholder={t('messages.messagePlaceholder')}
        selectionColor={globalStyles.primaryText.color}
        placeholderTextColor={theme.colors.inputPlaceholder}
        editable={!disabled}
        onChangeText={(text) => setValue(text)}
      />

      <TouchableOpacity
        // disabled — строго boolean, утечки значений в render нет:
        // правило писано для JSX-children, здесь ложное срабатывание
        // eslint-disable-next-line react/jsx-no-leaked-render
        disabled={disabled && (!value.trim() || showLoading)}
        style={styles.iconView}
        onPress={submit}
      >
        {showLoading
          ? (
            <ActivityIndicator
              size='small'
              color={theme.colors.primary}
              style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
            />
          )
          : (
            <Ionicons
              name='send'
              size={24}
              color={value ? theme.colors.primary : theme.colors.text}
            />
          )}
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;

import Octicons from '@expo/vector-icons/Octicons';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import BottomSheetModal from '~/components/BottomSheetModal';
import OptionsBottomSheet from '~/components/bottomSheets/OptionsBottomSheet';
import SettingRow from '~/components/SettingRow';
import Text from '~/components/Text';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { changeLanguage } from '~/i18n';
import { LanguagePreference } from '~/i18n';
import { persistLanguage } from '~/redux/persistSettings';
import { fontSize } from '~/utils/texts';

const languageLabels: Record<LanguagePreference, string> = {
  system: 'System',
  ru: 'Русский',
  en: 'English',
};

const options = (Object.entries(languageLabels) as Array<[LanguagePreference, string]>).map(
  ([value, label]) => ({
    label,
    value,
    isCurrent: false,
  })
);

const LanguageSetting = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.settings.config.language);
  const modalRef = useRef<BottomSheetModal | null>(null);
  const theme = useAppTheme();

  const selectLanguage = (selected: LanguagePreference) => {
    persistLanguage(dispatch, selected);
    void changeLanguage(selected);
    modalRef.current?.dismiss();
  };

  return (
    <>
      <SettingRow
        label={t('settings.language')}
        icon={<Octicons name={'globe'} size={24} color={theme.colors.text} />}
        onPress={() => modalRef.current?.present()}
        right={
          <Text style={fontSize.medium}>{languageLabels[language ?? 'system']}</Text>
        }
      />
      <OptionsBottomSheet
        ref={modalRef}
        options={options}
        onOptionPress={(value) => selectLanguage(value as LanguagePreference)}
        currentOptionValue={language ?? 'system'}
      />
    </>
  );
};

export default LanguageSetting;

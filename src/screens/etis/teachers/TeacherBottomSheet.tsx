import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Linking, StyleSheet, ToastAndroid, View
} from 'react-native';

import { getTeacherContacts } from '~/api/psu/api';
import { getTeacherById } from '~/api/psutech/api';
import type { ITeacherPSU } from '~/api/psutech/types';
import BorderLine from '~/components/BorderLine';
import BottomSheetContent from '~/components/BottomSheetContent';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import DisciplineType from '~/components/DisciplineType';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { LessonTypes } from '~/models/other';
import { ITeacher } from '~/models/teachers';
import { EducationNavigationProp } from '~/navigation/types';
import { borderRadius as radii, fontSize } from '~/utils/texts';

const TeacherContainer = ({ teacher }: { readonly teacher: ITeacher }) => {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();
  const navigation = useNavigation<EducationNavigationProp>();
  const { data: psuTeacher } = useQuery({
    queryFn: () => getTeacherById(teacher.id),
    queryKey: ['teacher', teacher.id],
  });

  const { data: contacts } = useQuery({
    // enabled гарантирует наличие page_url к моменту вызова queryFn
    queryFn: () => getTeacherContacts(psuTeacher?.psu?.page_url ?? ''),
    enabled: Boolean(psuTeacher?.psu?.page_url),
    queryKey: ['teacher_contacts', teacher.id],
  });

  const copyTeacherNameToClipboard = () => {
    if (teacher?.name) Clipboard.setStringAsync(teacher.name);
    ToastAndroid.show(t('common.copied'), ToastAndroid.LONG);
  };

  const copyCathedraToClipboard = () => {
    if (teacher?.cathedra) Clipboard.setStringAsync(teacher.cathedra);
    ToastAndroid.show(t('common.copied'), ToastAndroid.LONG);
  };

  const openPSUPage = () => {
    const pageUrl = psuTeacher?.psu?.page_url;
    if (pageUrl) {
      Linking.openURL(pageUrl);
    }
  };

  const navigateToTeacherTimetable = () => {
    navigation.navigate('CathedraTimetable', { teacherId: teacher.id });
  };

  const navigateToCathedraTimetable = () => {
    navigation.navigate('CathedraTimetable', { cathedraId: teacher.cathedraId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContainer}>
        <Image
          source={{
            uri: `https://student.psu.ru/pls/stu_cus_et/${teacher.photo}`,
          }}
          style={styles.photo}
        />
        <Text style={[fontSize.big, { fontWeight: 'bold' }]} onPress={copyTeacherNameToClipboard}>
          {teacher.name}
        </Text>
        <Text colorVariant={'text2'} onPress={copyCathedraToClipboard}>
          {teacher.cathedra}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <ClickableText
          viewStyle={[
            globalStyles.primaryBackgroundColor,
            globalStyles.borderRadius,
            styles.button,
          ]}
          textStyle={[globalStyles.primaryContrastText]}
          onPress={navigateToTeacherTimetable}
        >
          {t('teachers.lessonsTimetable')}
        </ClickableText>
        <ClickableText
          viewStyle={[
            globalStyles.primaryBackgroundColor,
            globalStyles.borderRadius,
            styles.button,
          ]}
          textStyle={globalStyles.primaryContrastText}
          onPress={navigateToCathedraTimetable}
        >
          {t('teachers.cathedraTimetable')}
        </ClickableText>
      </View>

      {psuTeacher?.psu?.page_url && contacts ? <>
        <ClickableText
          viewStyle={[globalStyles.primaryBorder, styles.button]}
          onPress={openPSUPage}
        >
          {t('teachers.psuPage')}
        </ClickableText>

        <BorderLine />

        <Text style={styles.title}>{t('teachers.contactInfo')}</Text>
        {Boolean(contacts.phones.length) && (
          <>
            <Text style={styles.title} colorVariant={'text2'}>
              {t('teachers.phone')}
            </Text>
            {contacts.phones.map((phone) => (
              <Text
                key={phone}
                style={fontSize.medium}
                onPress={() => phone && Clipboard.setStringAsync(phone)}
              >
                • {phone}
              </Text>
            ))}
          </>
        )}
        {Boolean(contacts.emails.length) && (
          <>
            <Text style={styles.title} colorVariant={'text2'}>
              {t('teachers.email')}
            </Text>
            {contacts.emails.map((email) => (
              <Text
                key={email}
                style={fontSize.medium}
                onPress={() => email && Clipboard.setStringAsync(email)}
              >
                • {email}
              </Text>
            ))}
          </>
        )}
        <ClickableText
          colorVariant={'primary'}
          viewStyle={{ alignSelf: 'flex-end' }}
          textStyle={{ fontWeight: 'bold' }}
          onPress={openPSUPage}
        >
          {t('teachers.source')}
        </ClickableText>
      </> : null}

      <BorderLine />

      <Text style={styles.title}>{t('teachers.subjects')}</Text>
      {teacher.subjects.map((subject, index) => (
        <React.Fragment key={index}>
          <Text style={fontSize.medium}>• {subject.discipline}</Text>
          <View style={styles.typesContainer}>
            {subject.types.filter((type): type is LessonTypes => type != null).map((type, index) => (
              <DisciplineType key={index} type={type} size={'small'} />
            ))}
          </View>
        </React.Fragment>
      ))}
    </View>
  );
};

const TeacherBottomSheet = React.forwardRef<BottomSheetModal, { readonly teacher: ITeacher | null }>(
  ({ teacher }, ref) => (
    <BottomSheetModal ref={ref} snapPoints={['50%', '90%']}>
      {teacher ? (
        <BottomSheetContent>
          <TeacherContainer teacher={teacher} />
        </BottomSheetContent>
      ) : null}
    </BottomSheetModal>
  )
);

export default TeacherBottomSheet;

const styles = StyleSheet.create({
  container: { marginHorizontal: '2%', gap: 4 },
  photo: { width: 140, height: 140, borderRadius: radii.medium },
  centeredContainer: { alignItems: 'center' },
  title: { ...fontSize.medium, fontWeight: 'bold' },
  button: { paddingVertical: '2%', paddingHorizontal: '4%', justifyContent: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  typesContainer: { flexDirection: 'row', gap: 8, marginLeft: '3%' },
});

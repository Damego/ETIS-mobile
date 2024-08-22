import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import React from 'react';
import { Linking, StyleSheet, ToastAndroid, View } from 'react-native';
import { getTeacherById } from '~/api/psutech/api';
import BorderLine from '~/components/BorderLine';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import DisciplineType from '~/components/DisciplineType';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { ITeacher } from '~/models/teachers';
import { EducationNavigationProp } from '~/navigation/types';
import { fontSize } from '~/utils/texts';

export interface TeacherBottomSheetProps {
  teacher: ITeacher;
}

const TeacherBottomSheet = React.forwardRef<BottomSheetModal, TeacherBottomSheetProps>(
  ({ teacher }, ref) => {
    const globalStyles = useGlobalStyles();
    const navigation = useNavigation<EducationNavigationProp>();
    const { data } = useQuery({
      queryFn: () => getTeacherById(teacher.id),
      queryKey: ['teacher', teacher.id],
    });

    const copyTeacherNameToClipboard = () => {
      Clipboard.setStringAsync(teacher.name);
      ToastAndroid.show('Скопировано в буфер обмена', ToastAndroid.LONG);
    };

    const copyCathedraToClipboard = () => {
      Clipboard.setStringAsync(teacher.cathedra);
      ToastAndroid.show('Скопировано в буфер обмена', ToastAndroid.LONG);
    };

    const openPSUPage = () => Linking.openURL(data.psu.page_url);

    const navigateToTeacherTimetable = () => {
      navigation.navigate('CathedraTimetable', { teacherId: teacher.id });
    };

    const navigateToCathedraTimetable = () => {
      navigation.navigate('CathedraTimetable', { cathedraId: teacher.cathedraId });
    };

    return (
      <BottomSheetModal ref={ref} snapPoints={['90%']}>
        <BottomSheetView style={styles.container}>
          <View style={styles.centeredContainer}>
            <Image
              source={{
                uri: `https://student.psu.ru/pls/stu_cus_et/${teacher.photo}`,
              }}
              style={styles.photo}
            />
            <Text
              style={[fontSize.big, { fontWeight: 'bold' }]}
              onPress={copyTeacherNameToClipboard}
            >
              {teacher.name}
            </Text>
            <Text colorVariant={'text2'} onPress={copyCathedraToClipboard}>
              {teacher.cathedra}
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <ClickableText
              onPress={navigateToTeacherTimetable}
              viewStyle={[
                globalStyles.primaryBackgroundColor,
                globalStyles.borderRadius,
                styles.button,
              ]}
              textStyle={[globalStyles.primaryContrastText]}
            >
              Расписание занятий
            </ClickableText>
            <ClickableText
              onPress={navigateToCathedraTimetable}
              viewStyle={[
                globalStyles.primaryBackgroundColor,
                globalStyles.borderRadius,
                styles.button,
              ]}
              textStyle={globalStyles.primaryContrastText}
            >
              Расписание кафедры
            </ClickableText>
          </View>

          {data?.psu && (
            <>
              <ClickableText
                onPress={openPSUPage}
                viewStyle={[globalStyles.primaryBorder, styles.button]}
              >
                Страница на сайте ПГНИУ
              </ClickableText>

              <BorderLine />

              <Text style={styles.title}>Контактная информация</Text>
              {!!data.psu.contacts?.phones.length && (
                <>
                  <Text style={styles.title} colorVariant={'text2'}>
                    Телефон
                  </Text>
                  {data.psu.contacts.phones.map((phone) => (
                    <Text
                      key={phone}
                      style={fontSize.medium}
                      onPress={() => Clipboard.setStringAsync(phone)}
                    >
                      • {phone}
                    </Text>
                  ))}
                </>
              )}
              {!!data.psu.contacts?.emails.length && (
                <>
                  <Text style={styles.title} colorVariant={'text2'}>
                    Электронная почта
                  </Text>
                  {data.psu.contacts.emails.map((email) => (
                    <Text
                      key={email}
                      style={fontSize.medium}
                      onPress={() => Clipboard.setStringAsync(email)}
                    >
                      • {email}
                    </Text>
                  ))}
                </>
              )}
              <ClickableText
                onPress={openPSUPage}
                colorVariant={'primary'}
                viewStyle={{ alignSelf: 'flex-end' }}
                textStyle={{ fontWeight: 'bold' }}
              >
                Источник
              </ClickableText>
            </>
          )}

          <BorderLine />

          <Text style={styles.title}>Преподаваемые дисциплины</Text>
          {teacher.subjects.map((subject, index) => (
            <React.Fragment key={index}>
              <Text style={fontSize.medium}>• {subject.discipline}</Text>
              <View style={styles.typesContainer}>
                {subject.types.map((type) => (
                  <DisciplineType type={type} size={'small'} />
                ))}
              </View>
            </React.Fragment>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default TeacherBottomSheet;

const styles = StyleSheet.create({
  container: { marginHorizontal: '2%', gap: 4 },
  photo: { width: 140, height: 140, borderRadius: 10 },
  centeredContainer: { alignItems: 'center' },
  title: { ...fontSize.medium, fontWeight: 'bold' },
  button: { paddingVertical: '2%', paddingHorizontal: '4%', justifyContent: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  typesContainer: { flexDirection: 'row', gap: 8, marginLeft: '3%' },
});

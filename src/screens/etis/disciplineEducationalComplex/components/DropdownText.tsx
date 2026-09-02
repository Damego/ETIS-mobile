import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from '~/components/Text';
import { useAppTheme } from '~/hooks/theme';
import { fontSize } from '~/utils/texts';

// Высота первой строки заголовка: стрелка выравнивается по её центру,
// чтобы у многострочных заголовков она не уезжала вниз. Текст с flex: 1
// не даёт длинному заголовку вытеснить стрелку за правый край
const TITLE_LINE_HEIGHT = 20;

const DropdownText = ({ title, value }: { title: string; value: string }) => {
  const theme = useAppTheme();
  const [isOpened, setOpened] = React.useState(false);

  return (
    <View style={{ gap: 4 }}>
      <TouchableOpacity
        onPress={() => setOpened((prev) => !prev)}
        style={styles.row}
      >
        <Text style={styles.title}>{title}</Text>
        <View style={styles.iconWrapper}>
          <AntDesign name={isOpened ? 'up' : 'down'} size={18} color={theme.colors.text} />
        </View>
      </TouchableOpacity>
      {isOpened && <Text style={fontSize.medium}>{value}</Text>}
    </View>
  );
};

export default DropdownText;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  title: {
    ...fontSize.medium,
    fontWeight: 'bold',
    lineHeight: TITLE_LINE_HEIGHT,
    flex: 1,
  },
  iconWrapper: {
    height: TITLE_LINE_HEIGHT,
    justifyContent: 'center',
  },
});

import { AntDesign, Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import Card from '~/components/Card';
import ClickableText from '~/components/ClickableText';
import LoadingScreen from '~/components/LoadingScreen';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useClient } from '~/data/client';
import { useGlobalStyles } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import { fontSize } from '~/utils/texts';
import { groupItems } from '~/utils/utils';

const Field = ({ value }: { value: string }) => {
  const globalStyles = useGlobalStyles();

  const copyValue = () => {
    Clipboard.setStringAsync(value);
  };

  return (
    <View
      style={[
        globalStyles.border,
        {
          paddingVertical: '2%',
          paddingHorizontal: '4%',
          justifyContent: 'space-between',
          flexDirection: 'row',
        },
      ]}
    >
      <Text selectable>{value}</Text>
      <TouchableOpacity onPress={copyValue}>
        <Feather name={'copy'} size={18} color={globalStyles.textColor.color} />
      </TouchableOpacity>
    </View>
  );
};

const DigitalResources = () => {
  const client = useClient();
  const { data, isLoading, refresh } = useQuery({
    method: client.getDigitalResources,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  const grouped = groupItems(data, (item) => item.category);

  return (
    <Screen containerStyle={{ gap: 16 }} onUpdate={refresh}>
      {grouped.map((resources) => (
        <View key={resources[0].category} style={{ gap: 8 }}>
          <Text style={[fontSize.big, { fontWeight: 'bold' }]}>{resources[0].category}</Text>
          {resources.map((resource) => (
            <Card key={resource.name} style={{ gap: 4 }}>
              <ClickableText
                onPress={() => resource.url && Linking.openURL(resource.url)}
                textStyle={[fontSize.medium]}
              >
                {resource.name}
              </ClickableText>
              {resource.accessCode ? (
                <Field value={resource.accessCode} />
              ) : (
                <>
                  <Field value={resource.login} />
                  <Field value={resource.password} />
                </>
              )}
            </Card>
          ))}
        </View>
      ))}
    </Screen>
  );
};

export default DigitalResources;

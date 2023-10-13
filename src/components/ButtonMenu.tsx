import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { fontSize } from '../utils/texts';
import Card from './Card';
import ClickableText from './ClickableText';

export interface ButtonMenuOption {
  name: string;
  value: unknown;
  isCurrent: boolean;
}

const ModalMenu = ({
  options,
  onSelect,
  onClose,
}: {
  options: ButtonMenuOption[];
  onSelect: (value: unknown) => void;
  onClose: () => void;
}) => {
  const globalStyles = useGlobalStyles();

  return (
    <Modal transparent onRequestClose={onClose}>
      <View
        style={[
          {
            padding: '2%',
            flex: 1,
            marginVertical: '20%',
            marginHorizontal: '2%',
          },
          globalStyles.block,
          globalStyles.border,
          globalStyles.shadow,
        ]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            style={[
              globalStyles.textColor,
              fontSize.large,
              { fontWeight: '500', marginBottom: '2%' },
            ]}
          >
            Выбор преподавателя
          </Text>
          <AntDesign
            name={'close'}
            size={28}
            color={globalStyles.textColor.color}
            onPress={onClose}
          />
        </View>

        <ScrollView contentContainerStyle={{ gap: 8 }} showsVerticalScrollIndicator={false}>
          {options.map((option) => {
            if (option.isCurrent)
              return (
                <View
                  key={option.name}
                  style={[
                    globalStyles.block,
                    globalStyles.border,
                    { padding: '2%', alignItems: 'center' },
                  ]}
                >
                  <Text style={globalStyles.primaryFontColor}>{option.name}</Text>
                </View>
              );
            return (
              <ClickableText
                text={option.name}
                onPress={() => onSelect(option.value)}
                key={option.name}
                textStyle={[globalStyles.textColor]}
                viewStyle={[
                  globalStyles.block,
                  globalStyles.border,
                  { padding: '2%', alignItems: 'center' },
                ]}
              />
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
};

const ButtonMenu = ({
  options,
  onSelect,
}: {
  options: ButtonMenuOption[];
  onSelect: (value: unknown) => void;
}) => {
  const globalStyles = useGlobalStyles();

  const [selectedOption, setSelectedOption] = useState<ButtonMenuOption>(options[0]);
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const openModal = () => setModalOpened(true);
  const closeModal = () => setModalOpened(false);

  const onOptionSelect = (value: unknown) => {
    setSelectedOption(options.find((option) => option.value === value));
    onSelect(value);
    closeModal();
  };

  return (
    <>
      {modalOpened && (
        <ModalMenu options={options} onSelect={onOptionSelect} onClose={closeModal} />
      )}

      <TouchableOpacity onPress={openModal}>
        <Card
          style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}
        >
          <Text style={[globalStyles.textColor, fontSize.medium, { fontWeight: '500' }]}>
            {selectedOption.name}
          </Text>
          <AntDesign name={'swap'} size={22} color={globalStyles.textColor.color} />
        </Card>
      </TouchableOpacity>
    </>
  );
};

export default ButtonMenu;

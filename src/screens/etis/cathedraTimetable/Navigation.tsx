import React from 'react';
import { View } from 'react-native';
import Dropdown from '~/components/Dropdown';
import PageNavigator from '~/components/PageNavigator';
import { useAppSelector, useGlobalStyles } from '~/hooks';
import { ICathedraTimetable, TimetableTypes } from '~/models/cathedraTimetable';

export const NavigationTypeDropdown = ({
  type,
  onSelect,
}: {
  type: TimetableTypes;
  onSelect: (type: TimetableTypes) => void;
}) => {
  const options = [
    {
      label: 'Сессии',
      value: TimetableTypes.sessions,
      current: false,
    },
    {
      label: 'Недели',
      value: TimetableTypes.weeks,
      current: false,
    },
  ];

  return (
    <View
      style={{
        marginLeft: 0,
        marginRight: 'auto',
        zIndex: 3,
      }}
    >
      <Dropdown
        selectedOption={options.find((option) => option.value === type)}
        options={options.map((option) => ({ ...option, current: option.value === type }))}
        onSelect={onSelect}
      />
    </View>
  );
};

const Navigation = ({
  data,
  onChange,
  type,
}: {
  data: ICathedraTimetable;
  onChange: (data: number) => void;
  type: TimetableTypes;
}) => {
  const globalStyles = useGlobalStyles();
  const { currentWeek } = useAppSelector((state) => state.student);

  if (type === TimetableTypes.weeks) {
    return (
      <PageNavigator
        firstPage={data.weekInfo.first}
        lastPage={data.weekInfo.last}
        currentPage={data.weekInfo.selected}
        onPageChange={onChange}
        pageStyles={{
          [currentWeek]: {
            view: {
              borderWidth: 2,
              borderRadius: globalStyles.border.borderRadius,
              borderColor: globalStyles.primaryFontColor.color,
            },
          },
        }}
      />
    );
  }

  const currentSession = data.sessions.find((session) => session.isCurrent);
  let currentOption;
  if (currentSession)
    currentOption = {
      label: currentSession.name,
      value: currentSession.number,
      current: false,
    };
  else
    currentOption = {
      label: 'Выберите период',
      value: '',
      current: false,
    };
  const options = data.sessions.map((session) => ({
    label: session.name,
    value: session.number,
    current: session.isCurrent,
  }));
  return (
    <View
      style={{
        marginLeft: 'auto',
        marginRight: 0,
        zIndex: 2,
      }}
    >
      <Dropdown selectedOption={currentOption} options={options} onSelect={onChange} />
    </View>
  );
};

export default Navigation;

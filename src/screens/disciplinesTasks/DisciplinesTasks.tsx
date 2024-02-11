import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import Screen from '../../components/Screen';
import { DisciplineStorage, DisciplineTask } from '../../models/disciplinesTasks';
import { compareTime } from '../../utils/datetime';

const DisciplinesTasks = () => {
  const [tasks, setTasks] = useState<DisciplineTask[]>();

  useEffect(() => {
    DisciplineStorage.getTasks().then(($tasks) => {
      setTasks($tasks.sort((a, b) => compareTime(a.datetime, b.datetime)));
    });
  }, []);

  if (!tasks.length) return;

  return (
    <Screen>
      <View>
        <Text>Сегодня</Text>
        <CardHeaderIn topText={'Математический анализ'}>
          <Text>Решить 10 задач: 800, 801, 802, 803, 804, 805, 806</Text>
        </CardHeaderIn>
      </View>
      {tasks.map((task) => (
        <View>
          <Text>{task.datetime.toISOString()}</Text>
          <CardHeaderIn topText={task.disciplineName}>
            <Text>{task.description}</Text>
          </CardHeaderIn>
        </View>
      ))}
    </Screen>
  );
};

export default DisciplinesTasks;

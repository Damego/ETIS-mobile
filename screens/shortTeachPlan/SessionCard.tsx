import React from 'react';

import CardHeaderOut from '../../components/CardHeaderOut';
import Subject from './Discipline';
import { ISessionTeachPlan } from '../../models/teachPlan';

const SessionCard = ({ data } : {data: ISessionTeachPlan}) => (
  <CardHeaderOut topText={data.stringSession}>
    {data.disciplines.map((discipline, index) => (
      <Subject
        data={discipline}
        showBorderLine={index !== data.disciplines.length - 1}
        key={discipline.name}
      />
    ))}
  </CardHeaderOut>
);

export default SessionCard;

import React from 'react';

import CardHeaderOut from '../../components/CardHeaderOut';
import Subject from './Subject';

const Trimester = ({ data }) => (
  <CardHeaderOut topText={data.trimester} key={`card-${data.trimester}`}>
    {data.subjects.map((subject, index) => (
      <Subject
        data={subject}
        showBorderLine={index !== data.subjects.length - 1}
        key={subject.subject}
      />
    ))}
  </CardHeaderOut>
);

export default Trimester;

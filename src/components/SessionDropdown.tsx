import React from 'react';

import Dropdown from './Dropdown';

const buildOption = (session: number, sessionName: string) => ({
  label: `${session} ${sessionName}`,
  value: session,
});

function buildSessionOptions(currentSession: number, latestSession: number, sessionName: string) {
  const options = [];
  for (let index = latestSession; index > 0; index -= 1) {
    if (index !== currentSession) options.push(buildOption(index, sessionName));
  }

  return {
    current: buildOption(currentSession, sessionName),
    options,
  };
}

export default function SessionDropdown({ currentSession, latestSession, sessionName, onSelect }: {
  currentSession: number;
  latestSession: number;
  sessionName: string;
  onSelect(...args): unknown
}) {
  const options = buildSessionOptions(currentSession, latestSession, sessionName);

  return (
    <Dropdown onSelect={onSelect} selectedOption={options.current} options={options.options} />
  );
}

export { buildSessionOptions };

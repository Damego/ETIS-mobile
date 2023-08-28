import React from 'react';

import Dropdown from './Dropdown';

const buildOption = (session: number, sessionName: string, current: boolean) => ({
  label: `${session} ${sessionName}`,
  value: session,
  current,
});

function buildSessionOptions(currentSession: number, latestSession: number, sessionName: string) {
  const options = [];
  for (let index = latestSession; index > 0; index -= 1) {
    options.push(buildOption(index, sessionName, index === currentSession));
  }

  return {
    current: buildOption(currentSession, sessionName, false),
    options,
  };
}

export default function SessionDropdown({
  currentSession,
  latestSession,
  sessionName,
  onSelect,
}: {
  currentSession: number;
  latestSession: number;
  sessionName: string;
  onSelect(session: number): unknown;
}) {
  const options = buildSessionOptions(currentSession, latestSession, sessionName);

  return (
    <Dropdown onSelect={onSelect} selectedOption={options.current} options={options.options} />
  );
}

export { buildSessionOptions };

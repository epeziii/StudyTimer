import React, { createContext, useState, useMemo } from 'react';

export const TimerSettingsContext = createContext();

export const TimerSettingsProvider = ({ children }) => {
  const [workInterval, setWorkInterval] = useState(25 * 60);
  const [restInterval, setRestInterval] = useState(5 * 60);
  const [setCount, setSetCount] = useState(5);
  const [selectedSound, setSelectedSound] = useState('Default');

  const contextValue = useMemo(() => ({
    workInterval,
    restInterval,
    setCount,
    selectedSound,
    setWorkInterval,
    setRestInterval,
    setSetCount,
    setSelectedSound,
  }), [workInterval, restInterval, setCount, selectedSound]);

  return (
    <TimerSettingsContext.Provider value={contextValue}>
      {children}
    </TimerSettingsContext.Provider>
  );
};


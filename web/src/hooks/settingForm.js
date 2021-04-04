import React, { useState } from 'react';
const useSettingForm = (initialState) => {
  const [setting, setSetting] = useState(initialState);

  const handleInputChange = (event) => {
    if (event.target.name === 'server' && event.target.value.endsWith('/')) {
      event.target.value = event.target.value.slice(0, -1);
    }
    setSetting({
      ...setting,
      [event.target.name]: event.target.value,
    });
  };
  return [setting, setSetting, handleInputChange];
};
export default useSettingForm;

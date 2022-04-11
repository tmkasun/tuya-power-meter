
export const APIOrigin = process.env.REACT_APP_API_ORIGIN;
export const Configs = (() => {
  const tempConfigs: { [key: string]: string } = {};
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith('REACT_APP_')) {
      const configKey = key.replace('REACT_APP_', '');
      const configValue = process.env[key];
      if (configKey && configValue) {
        tempConfigs[configKey] = configValue;
      }
    }
  });
  return tempConfigs;
})();

export default Configs;

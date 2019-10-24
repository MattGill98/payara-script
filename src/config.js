import ConfigStore from 'configstore';
import packageJson from '../package.json';

const defaultConfig = {
  username: null,
  password: null,
  directory: require('os').homedir() + '/payara',
  active: null
};

export default new ConfigStore(packageJson.name, defaultConfig);
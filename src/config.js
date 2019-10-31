import ConfigStore from 'configstore';
import packageJson from '../package.json';
import fs from 'promise-fs';
import path from 'path';

const defaultConfig = {
  username: null,
  password: null,
  directory: path.resolve(require('os').homedir(), 'payara/'),
  active: null
};

// Create base directory
fs.mkdir(defaultConfig.directory, () => {});

export default new ConfigStore(packageJson.name, defaultConfig);
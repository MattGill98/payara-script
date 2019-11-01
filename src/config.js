import ConfigStore from 'configstore';
import path from 'path';
import packageJson from '../package.json';
import { mkdir } from './util/promise-fs';

const defaultConfig = {
  username: null,
  password: null,
  directory: path.resolve(require('os').homedir(), 'payara/'),
  active: null
};

// Create base directory
mkdir(defaultConfig.directory, () => {});

export default new ConfigStore(packageJson.name, defaultConfig);
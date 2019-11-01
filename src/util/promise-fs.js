import fs from 'fs';
import { promisify } from 'util';

export const copyFile = promisify(fs.copyFile);
export const exists = promisify(fs.exists);
export const mkdir = promisify(fs.mkdir);
export const readdir = promisify(fs.readdir);
export const rename = promisify(fs.rename);
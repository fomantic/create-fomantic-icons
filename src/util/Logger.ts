// npm
import { Signale } from 'signale';
import ora, { Options as oraOptions } from 'ora';

export const LoggerInstance = Signale;

export function spinner(options?: oraOptions) {
  return ora(options);
}

export default new Signale();

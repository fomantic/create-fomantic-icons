// npm
import signale from 'signale';
const { Signale } = signale;
import ora from 'ora';
export const LoggerInstance = Signale;
export function spinner(options) {
    return ora(options);
}
export default new Signale();

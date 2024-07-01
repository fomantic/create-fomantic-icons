// @ts-ignore
import numWords from 'num-words';
export default class Converter {
    static NUMERIC_ONLY = /^\d+$/;
    static iconClassName(name) {
        return name
            .toLowerCase()
            .replace(/-alt$/, '-alternate')
            .replace(/-alt-/, '-alternate-')
            .replace(/-h$/, '-horizontal')
            .replace(/-h-/, '-horizontal-')
            .replace(/-v$/, '-vertical')
            .replace(/-v-/, '-vertical-')
            .replace(/-alpha$/, '-alphabet')
            .replace(/-alpha-/, '-alphabet-')
            .replace(/-asc$/, '-ascending')
            .replace(/-asc-/, '-ascending-')
            .replace(/-desc$/, '-descending')
            .replace(/-desc-/, '-descending-')
            .replace(/-/g, '.')
            .replace(/\s/g, '.')
            .split('.')
            .map((entity) => (Converter.NUMERIC_ONLY.test(entity)
            ? numWords(parseInt(entity, 10))
            : entity))
            .join('.');
    }
    static iconName(name) {
        return Converter.iconClassName(name)
            .replace(/\./g, ' ');
    }
}

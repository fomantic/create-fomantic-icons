// @ts-ignore
import numWords from 'num-words';

export default class Converter {
  private static NUMERIC_ONLY = /^\d+$/;

  public static iconClassName(name: string): string {
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
      .map((entity: string) => (Converter.NUMERIC_ONLY.test(entity)
        ? numWords(parseInt(entity, 10))
        : entity))
      .join('.');
  }

  public static iconName(name: string): string {
    return Converter.iconClassName(name)
      .replace(/\./g, ' ');
  }
}

import * as numWords from 'num-words';


export default class Converter {
  private static CLASSNAME_REPLACEMENTS: { [key: string]: string; } = {
    0: 'zero',
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
  };

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
      .map((entity: string) => {
        return Converter.NUMERIC_ONLY.test(entity)
          ? numWords(entity)
          : entity;
      })
      .join('.');
  }

  public static iconName(name: string): string {
    return Converter.iconClassName(name)
      .replace(/\./g, ' ');
  }
}

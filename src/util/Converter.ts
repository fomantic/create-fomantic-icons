export default class Converter {
  public static iconClassName(name: string): string {
    return name
      .replace(/-alt$/, '-alternate')
      .replace(/-alt-/, '-alternate-')
      .replace(/-h$/, '-horizontal')
      .replace(/-h-/, '-horizontal-')
      .replace(/-V$/, '-vertical')
      .replace(/-V-/, '-vertical-')
      .replace(/-alpha$/, '-alphabet')
      .replace(/-alpha-/, '-alphabet-')
      .replace(/-asc$/, '-ascending')
      .replace(/-asc-/, '-ascending-')
      .replace(/-desc$/, '-descending')
      .replace(/-desc-/, '-descending-')
      .replace(/-/g, '.')
      .replace(/\s/g, '.');
  }

  public static iconName(name: string): string {
    return Converter.iconClassName(name)
      .replace(/\./g, ' ');
  }
}

// utils
import Converter from '../util/Converter';

// enums
import IconType from '../enums/IconType';

// static
import corrections from '../static/corrections.json';

export interface IconData {
  name: string;
  unicode: string;
  type: IconType;
  searchTerms: string[];
}

export default class Icon {
  private readonly data: IconData;

  constructor(data: IconData) {
    this.data = data;
  }

  private hasCorrection(field: string): boolean {
    const iconCorrection = (corrections as any)[this.rawName];

    if (iconCorrection !== undefined) {
      return iconCorrection[field] !== undefined;
    }

    return false;
  }

  private correction(field: string): string {
    return this.hasCorrection(field)
      ? (corrections as any)[this.rawName][field]
      : '';
  }

  get rawName(): string {
    return this.data.name;
  }

  get name(): string {
    let {
      name,
    } = this.data;

    if (this.type === IconType.OUTLINE) {
      name += '-outline';
    }

    if (this.type === IconType.THIN) {
      name += '-thin';
    }

    if (this.type === IconType.DUOTONE) {
      name += '-duotone';
    }

    return this.hasCorrection('name')
      ? this.correction('name')
      : Converter.iconName(name);
  }

  get className(): string {
    return this.hasCorrection('className')
      ? this.correction('className')
      : Converter.iconClassName(this.name);
  }

  get unicode(): string {
    return this.hasCorrection('unicode')
      ? this.correction('unicode')
      : `\\${this.data.unicode}`;
  }

  get secondaryUnicode(): string {
    return this.hasCorrection('unicode')
      ? this.correction('unicode')
      : `\\10${this.data.unicode}`;
  }

  get type(): IconType {
    return this.data.type;
  }

  get searchTerms(): string {
    return this.data.searchTerms.join(', ');
  }
}

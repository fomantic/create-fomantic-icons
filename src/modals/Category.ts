// static
import categories from '../static/categories.json';

// modals
import Icon from './Icon';

export interface CategoryData {
  name: string;
  label: string;
  icons: Icon[];
}

export default class Category {
  private readonly data: CategoryData;

  constructor(data: CategoryData) {
    this.data = data;
  }

  get rawName(): string {
    return this.data.name;
  }

  get name(): string {
    return this.data.label;
  }

  get description(): string {
    return (categories as any)[this.rawName];
  }

  get icons(): Icon[] {
    return this.data.icons;
  }
}

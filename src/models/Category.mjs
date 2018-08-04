/*
  Category Model
 */


class Category {
  /**
   * Create a new Icon
   *
   * @param {string} faName The name used by FontAwesome
   * @param {string} fuiName The name used by Fomantic UI
   * @param {string} description The category description
   * @param {Icon[]} icons The category icons
   *
   * @returns {Category}
   */
  constructor(
    faName,
    fuiName,
    description,
    icons
  ) {
    this.faName = faName;
    this.fuiName = fuiName;
    this.description = description;
    this.icons = icons;
  }
  
  /**
   * Get the FontAwesome category name
   *
   * @return {string}
   */
  getFAName() {
    return String(this.faName);
  }
  
  /**
   * Get the Fomantic UI name
   *
   * @return {string}
   */
  getFUIName() {
    return String(this.fuiName);
  }
  
  /**
   * Get the category icons
   *
   * @return {Icon[]}
   */
  getIcons() {
    return this.icons || [];
  }
  
  /**
   * Get the category description
   *
   * @return {string}
   */
  getDescription() {
    return this.description;
  }
}


export default Category;

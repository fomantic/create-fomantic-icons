/*
  Icon Model
 */


class Icon {
  /**
   * Create a new Icon
   *
   * @param {string} faName The name used by FontAwesome
   * @param {string} fuiName The name used by Fomantic UI
   * @param {string} className The class which will be used by Fomantic UI
   * @param {string} unicode The icon unicode
   * @param {boolean} isSolid Whether the icon is a solid icon
   * @param {boolean} isOutline Whether the icon is an outline icon
   * @param {boolean} isBrand Whether the icon is a brand icon
   * @param {boolean} isThin Whether the icon is a light icon
   * @param {string[]} categories The icon categories
   *
   * @returns {Icon}
   */
  constructor(
    faName,
    fuiName,
    className,
    unicode,
    isSolid,
    isOutline,
    isBrand,
    isThin,
    categories
  ) {
    this.faName = faName;
    this.fuiName = fuiName;
    this.className = className;
    this.unicode = unicode;
    this.solid = isSolid;
    this.outline = isOutline;
    this.brand = isBrand;
    this.thin = isThin;
    this.categories = categories;
  }
  
  /**
   * Get the FontAwesome name
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
   * Get the Fomantic UI class name
   *
   * @return {string}
   */
  getClassName() {
    return String(this.className);
  }
  
  /**
   * Get the unicode
   *
   * @return {string}
   */
  getUnicode() {
    return String(this.unicode);
  }
  
  /**
   * Check whether the icon is a solid icon
   *
   * @return {boolean}
   */
  isSolid() {
    return this.solid === true;
  }
  
  /**
   * Check whether the icon is an outline icon
   *
   * @return {boolean}
   */
  isOutline() {
    return this.outline === true;
  }
  
  /**
   * Check whether the icon is a brand icon
   *
   * @return {boolean}
   */
  isBrand() {
    return this.brand === true;
  }
  
   /**
   * Check whether the icon is a light icon
   *
   * @return {boolean}
   */
  isThin() {
    return this.thin === true;
  }
  
  /**
   * Get the icon categories
   *
   * @return {string[]}
   */
  getCategories() {
    return this.categories;
  }
}


export default Icon;

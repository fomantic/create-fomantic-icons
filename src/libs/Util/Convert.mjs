/*
  Convert functions
 */

class Convert {
  /**
   * Convert an FontAwesome icon name to the Fomantic UI equivalent class name
   *
   * @param {string} faName The FontAwesome icon name
   *
   * @return {string}
   */
  static fuiClassName(faName) {
    let newName = faName;
    
    // alternate transformation
    if (newName.endsWith('-alt')) {
      newName = newName.substring(0, newName.length - 4) + '-alternate';
    }
    
    if (newName.includes('-alt-')) {
      newName = newName.replace('-alt-', '-alternate-');
    }
    
    // horizontal transformation
    if (newName.endsWith('-h')) {
      newName = newName.substring(0, newName.length - 2) + '-horizontal';
    }
    
    if (newName.includes('-h-')) {
      newName = newName.replace('-h-', '-horizontal-');
    }
    
    // vertical transformation
    if (newName.endsWith('-v')) {
      newName = newName.substring(0, newName.length - 2) + '-vertical';
    }
    
    if (newName.includes('-v-')) {
      newName = newName.replace('-v-', '-vertical-');
    }
    
    // alphabet transformation
    if (newName.endsWith('-alpha')) {
      newName = newName.substring(0, newName.length - 6) + '-alphabet';
    }
    
    if (newName.includes('-alpha-')) {
      newName = newName.replace('-alpha-', '-alphabet-');
    }
    
    // ascending transformation
    if (newName.endsWith('-asc')) {
      newName = newName.substring(0, newName.length - 4) + '-ascending';
    }
    
    if (newName.includes('-asc-')) {
      newName = newName.replace('-asc-', '-ascending-');
    }
    
    // descending transformation
    if (newName.endsWith('-desc')) {
      newName = newName.substring(0, newName.length - 5) + '-descending';
    }
    
    if (newName.includes('-desc-')) {
      newName = newName.replace('-desc-', '-descending-');
    }
    
    return String(newName.replace(/-/g, '.'));
  }
  
  /**
   * Convert an FontAwesome icon name to the Fomantic UI equivalent
   *
   * @param {string} faName The FontAwesome icon name
   *
   * @return {string}
   */
  static fuiName(faName) {
    faName = this.fuiClassName(faName);
    
    return String(faName.replace(/\./g, ' '));
  }
  
  /**
   * Convert an FontAwesome category name to the Fomantic UI equivalent
   *
   * @param {string} faName The FontAwesome category name
   *
   * @return {string}
   */
  static categoryName(faName) {
    let words = faName.replace('-', ' & ').split(' ');
    
    words = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    
    return words.join(' ');
  }
}


export default Convert;

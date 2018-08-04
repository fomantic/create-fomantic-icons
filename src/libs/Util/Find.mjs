/*
  Find functions
 */
import YAML from 'yamljs';


class Find {
  /**
   * Get the category for the specified icon
   *
   * @param {string} faName The FontAwesome icon name
   * @param {string} categoryData The category yaml file content
   */
  static categories(faName, categoryData) {
    let categories = YAML.parse(categoryData);
    let names = Object.keys(categories);
    let iconCategories = [];
    
    names.forEach((name, index) => {
      let category = categories[name];
      
      if(category['icons'].includes(faName)) {
        iconCategories.push(names[index]);
      }
    });
    
    return iconCategories;
  }
}


export default Find;

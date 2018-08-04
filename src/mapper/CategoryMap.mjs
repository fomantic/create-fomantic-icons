import { Convert } from './../libs/Util';
import CategoryDescriptions from './../../static/category-descriptions.json';
import Category from './../models/Category.mjs';


function map(icons) {
  let categories = {};
  
  icons.forEach((icon) => {
    icon.getCategories().forEach((category) => {
      if (categories[category] === undefined) {
        categories[category] = [];
      }
      
      categories[category].push(icon);
    });
  });
  
  let categoryKeys = Object.keys(categories);
  let brandIcons = categories['brands'];
  let sortedCategories = [];
  
  categoryKeys.sort().map((categoryName) => {
    if (categoryName !== 'brands') {
      sortedCategories.push(new Category(
        categoryName,
        Convert.categoryName(categoryName),
        CategoryDescriptions[categoryName],
        categories[categoryName]
      ));
    }
  });
  
  sortedCategories.push(new Category(
    'brands',
    Convert.categoryName('brands'),
    CategoryDescriptions['brands'],
    brandIcons
  ));
  
  return sortedCategories;
}


export default map;

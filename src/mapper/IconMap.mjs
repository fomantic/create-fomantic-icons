import assign from 'circle-assign';
import Icon from './../models/Icon.mjs';
import { Convert, Find } from './../libs/Util';
import Corrections from './../../static/corrections';


function map(iconMetadata, categoryData) {
  
  const iconKeys = Object.keys(iconMetadata);
  let icons = [];
  
  iconKeys.forEach((faName) => {
    let icon = iconMetadata[faName];
	
	if (icon['private'] !== undefined && icon['private'] === true) {
	  return;
	}
	
    let isSolid = icon['styles'].includes('solid');
    let isOutline = icon['styles'].includes('regular');
    let isBrand = icon['styles'].includes('brands');
    let categories = Find.categories(faName, categoryData);
    let iconInfo = {
      faName: faName,
      fuiName: Convert.fuiName(faName),
      className: Convert.fuiClassName(faName),
      unicode: icon['unicode'],
      categories: categories
    };
    
    iconInfo = assign(iconInfo, Corrections[faName] || {});
    
    // need to do ifs because an icon can't be multiple types (each icon type has its own entry)
    // e.g. users and users.outline will both have an icon entry
    
    if (isSolid) {
      icons.push(new Icon(
        iconInfo.faName,
        iconInfo.fuiName,
        iconInfo.className,
        iconInfo.unicode,
        true,  // solid
        false, // outline
        false, // brand
        iconInfo.categories
      ));
    }
    
    if (isOutline) {
      icons.push(new Icon(
        iconInfo.faName,
        `${iconInfo.fuiName} outline`,
        `${iconInfo.className}.outline`,
        iconInfo.unicode,
        false, // solid
        true,  // outline
        false, // brand
        iconInfo.categories
      ));
    }
    
    if (isBrand) {
      icons.push(new Icon(
        iconInfo.faName,
        iconInfo.fuiName,
        iconInfo.className,
        iconInfo.unicode,
        false, // solid
        false, // outline
        true,  // brand
        [...categories, 'brands']
      ));
    }
    
  });
  
  // sort icon names A-Z
  icons.sort((a, b) => {
    if (a.getClassName() < b.getClassName()) return -1;
    if (a.getClassName() > b.getClassName()) return 1;
    return 0;
  });
  
  return icons;
  
}


export default map;

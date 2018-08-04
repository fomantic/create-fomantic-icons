const Crather = require('@hamistudios/crather');

module.exports = Crather.script(function() {
  
  if(this.getData()['brands']['aliases']['font'] !== '') {
    
    this.setRender(`
  /* Brands Aliases */
  {{ brands.aliases.font }} {
    font-family: @brandFontName;
  }
  
  /* Brands Alias Definitions */
  {{ brands.aliases.definitions }}`);
    
  }
  
  this.finished();
  
});

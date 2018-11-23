const Crather = require('@hamistudios/crather');

module.exports = Crather.script(function() {
  
  if(this.getData()['thin']['aliases']['font'] !== '') {
    
    this.setRender(`
  /* Thin Aliases */
  {{ thin.aliases.font }} {
    font-family: @lightFontName;
  }
  
  /* Thin Alias Definitions */
  {{ thin.aliases.definitions }}`);
    
  }
  
  this.finished();
  
});

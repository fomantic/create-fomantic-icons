const Crather = require('@hamistudios/crather');

module.exports = Crather.script(function() {
  
  if(this.getData()['outline']['aliases']['font'] !== '') {
    
    this.setRender(`
  /* Outline Aliases */
  {{ outline.aliases.font }} {
    font-family: @outlineFontName;
  }
  
  /* Outline Alias Definitions */
  {{ outline.aliases.definitions }}`);
    
  }
  
  this.finished();
  
});

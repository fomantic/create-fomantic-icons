const Crather = require('@hamistudios/crather');

module.exports = Crather.script(function() {
  
  if(this.getData()['solid']['aliases'] !== '') {
    
    this.setRender(`
/* Aliases */
{{ solid.aliases }}`);
    
  }
  
  this.finished();
  
});

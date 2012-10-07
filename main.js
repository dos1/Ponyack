define(['mods/menu','libs/jquery', 'libs/underscore'], function(Menu) {
  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g,
       evaluate : /\{\|(.+?)\|\}/g
  };

  window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  
  $(function() {
    $.get('server/login', {}, function(data) {
      window.user = data; // FIXME
      Menu.init();
      $('#loading').fadeOut(1000);
      $('#wrapper').hide().removeClass('hidden').fadeIn(1000);
    }, 'json').error(function() { alert('Server error - try again later!'); });
  });
});

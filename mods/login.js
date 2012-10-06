define(["libs/text!templates/login.tpl", "libs/text!drawings/login.txt", "libs/canvas", "libs/jquery", "libs/underscore"], function(TLogin, DLogin, Canvas) {

  var $node;
  
  function init() {
    $node = $('#content');
    var template=_.template(TLogin);
    $node.empty().append(template());

    var canvas = Canvas.init($node.find('canvas'));
    //canvas.pause(true);
    canvas.draw(26, 23, JSON.parse(DLogin), 1);
    
    $node.find('#return').on('click', function() {
      //console.log(JSON.stringify(canvas.get()));
      window.location.reload();
    });

    $node.find('form').on('submit', function() {
      $('#wrapper').fadeOut(500, function() {
        $node.html('Please wait...');
        $('#wrapper').fadeIn(500, function() {
          window.location.reload();
          // TODO: login here...
          //define(["mods/create", function(Create) {
          //  Create.init();
          //});
        });
      });
      return false;
    });

    $('#wrapper').fadeIn(1000);
  }
  
  return { init: init };
});
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
      return false;
    });

    $node.find('form').on('submit', function() {
      var login = $('#nickname').val(), pass = $('#pass').val();
      if (!(login && pass)) return false;
      $('#wrapper').fadeOut(500, function() {
        $node.html('Please wait...');
        $('#wrapper').fadeIn(500, function() {
          $.post('server/login', {login:login, pass:pass}, function(data) {
            //var data={status:"OK", hasCharacter: false};
            if (data.status==="OK") {
              window.user = data;
              if (data.hasCharacter) {
                require(["mods/game"], function(Game) {
                  $('#wrapper').fadeOut(500, function() {
                    Game.init();
                  });
                });
              } else {
                require(["mods/create"], function(Create) {
                  $('#wrapper').fadeOut(500, function() {
                    Create.init();
                  });
                });
              }
            } else {
              init();
              $node.prepend($('<div></div>').html('Wrong password or nickname already taken.'));
            }
          }, 'json').error(function() { alert('Error!'); window.location.reload(); });
        });
      });
      return false;
    });

    $('#wrapper').fadeIn(1000);
  }
  
  return { init: init };
});

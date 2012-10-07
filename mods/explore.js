define(["libs/text!templates/explore.tpl", "libs/text!drawings/about.txt", "libs/canvas", "libs/jquery", "libs/underscore"], function(TExplore, Canvas) {

  var $node;
  
  function init() {
    $node = $('#content');
    var template=_.template(TExplore);
    $node.empty().append(template());

    $node.find('#return').on('click', function() {
      window.location.reload();
      return false;
    });

    $('#wrapper').fadeIn(1000);
  }
  
  return { init: init };
});

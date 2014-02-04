if (typeof phantom == 'undefined')
{
    var usage = 'Usage: phantomjs GenerateImages.js\r\n';
    usage +=    'Sorry, are you trying to use a different JavaScript engine?';

    if      (typeof alert   != 'undefined') (function(){alert(usage);       })();
    else if (typeof console != 'undefined') (function(){console.log(usage); })();
    else if (typeof WScript != 'undefined') (function(){WScript.echo(usage);})();
}
else (function()
{
    var page = require('webpage').create();

    page.zoomFactor = 0.5;

    page.open('../index.html', function()
    {
      // Inject a function into the webpage that returns the bounding box of each canvas element
      var rects = page.evaluate(function()
      {
          // Hide images - otherwise things get a bit circular and messed up
          $('img').addClass("hidden");
      
          var rects = {};
      
          $('canvas').each(function(index, value)
          {
            rects[$(value).attr('id')] = value.getBoundingClientRect();
          });

          return rects;
      });
      
      for(var id in rects)
      {
          // Use the canvas's bounding box to render an png of just the canvas
          var rect = rects[id];
          page.clipRect =
          {
            left:   rect.left   * page.zoomFactor,
            top:    rect.top    * page.zoomFactor,
            width:  rect.width  * page.zoomFactor,
            height: rect.height * page.zoomFactor
          };
          page.render(id + '.png');
      }
      
      phantom.exit();
      
    });
})();


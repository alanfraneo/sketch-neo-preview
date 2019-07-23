var GridHTML = {};

GridHTML.getHTML = function (context, config) {
  var neogallerycss = GridHTML.getCSS(context);
  var neogalleryjs = GridHTML.getJS(context);
  var html =
    '<!DOCTYPE HTML><html><head><meta charset=utf-8><title>NeoGallery</title>\
    	<style>'+neogallerycss+'</style>\
      </head><body><div id="title"></div>\
      <div id="tabs"></div>\
      <div id="neogallery"></div></body>\
    	<script>var imgconfig = '+config+';\
      '+neogalleryjs+'</script>\
     </html>';
  return html;
};


GridHTML.getCSS = function (context) {
  var sketch = context.api();
  var cssURL = sketch.resourceNamed('neogallery.css');
  return GridHTML.readTextFromFile(cssURL);
}

GridHTML.getJS = function (context) {
  var sketch = context.api();
  var jsURL = sketch.resourceNamed('neogallery.js');
  return GridHTML.readTextFromFile(jsURL);
}

GridHTML.readTextFromFile = function(filePath) {
    var fileManager = [NSFileManager defaultManager];
    if([fileManager fileExistsAtPath:[filePath path]]) {
        return [NSString stringWithContentsOfFile:[filePath path] encoding:NSUTF8StringEncoding error:nil];
    }
    log('file doesnt exist');
    return nil;
}

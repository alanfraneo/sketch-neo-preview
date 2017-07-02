@import './fs-utils.js';
@import './grid-html.js';

var onRun = function (context) {
  var sketch = context.api();
  var application = sketch.Application();
  var document = context.document;
  var pages = document.pages();
  var docLocation = document.fileURL().path().split(document.displayName())[0];
  log(docLocation);
  var exportPath = docLocation + "/neogallery/";

  FSUtil.deleteAndCreateFolder(exportPath);
  var imageExportPath = exportPath + "img/";
  FSUtil.createFolder(imageExportPath);
  var imgConfigList = []
  for (var i = 0; i < pages.count(); i++) {
      log(pages[i].name())
      let page = pages[i]
      if (page.name() == "Symbols" || page.name().indexOf("_") == 0) {
  			log('skipping page: '+page.name());
  		}
      else{
        document.setCurrentPage(page);
        var artboards = page.artboards()
        for (var j = 0; j < artboards.count(); j++) {
            var artboard = artboards[j];
            let filename = artboard.name() + ".png";
            context.document.saveArtboardOrSlice_toFile_(scaleArtboard(artboard), imageExportPath + filename);
            imgconfig = {'imageURL': 'img/'+filename}
            imgConfigList.push(imgconfig);
        }
      }
  }
  var config = {"Images" : imgConfigList, "createdDate": currentDate()}
  var htmlString = GridHTML.getHTML(context, JSON.stringify(config));
  var someString = [NSString stringWithFormat:"%@", htmlString], filePath = exportPath+"index.html";
  [someString writeToFile:filePath atomically:true encoding:NSUTF8StringEncoding error:nil];
  var file = NSURL.fileURLWithPath(filePath);
  NSWorkspace.sharedWorkspace().openFile(file.path());
  application.alert("Artboards are exported in 'neogallery' folder next to your sketch file.", "Export Successful!");
};

var currentDate = function () {
  var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth();
  var curr_year = d.getFullYear();
  return curr_date + " " + m_names[curr_month] + ", " + curr_year;
}

var scaleArtboard = function(layer) {
    var rect = layer.absoluteInfluenceRect()
    var request = [MSExportRequest new]
    request.rect = rect
    request.scale = 2
    return request
 };

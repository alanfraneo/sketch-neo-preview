@import './fs-utils.js';
@import './grid-html.js';

/**
function for exporting all artboards from all pages except, Symbols, Styles and pages beginning with _
*/
var exportAllPages = function (context) {
  var sketch = context.api();
  var app = sketch.Application();
  var doc = context.document;
  var pages = doc.pages();
  var exportPath = getExportPath(doc);
  var imgConfigList = []
  for (var i = 0; i < pages.count(); i++) {
      var page = pages[i];
      if (page.name() == "Symbols" || page.name().indexOf("_") == 0 || page.name() == "Styles") {
  			log('skipping page: '+page.name());
  		}
      else{
        doc.setCurrentPage(page);
        var imgConfigListForPage = exportArtboardsOfPage(doc, page, exportPath);
        log(imgConfigListForPage);
        imgConfigList = imgConfigList.concat(imgConfigListForPage);
        log(imgConfigList);
      }
  }
  createAndOpenHTML(imgConfigList, exportPath, context);
};

/**
function for exporting all artboards from current page.
*/
var exportCurrentPage = function (context) {
  var sketch = context.api();
  var app = sketch.Application();
  var doc = context.document;
  var exportPath = getExportPath(doc);
  let page = doc.currentPage();
  var imgConfigList = exportArtboardsOfPage(doc, page, exportPath);
  createAndOpenHTML(imgConfigList, exportPath, context);
};
/**
function for deleting old export folder and creating a new one
*/
var getExportPath = function (doc) {
  var docLocation = doc.fileURL().path().split(doc.displayName())[0];
  log(docLocation);
  var exportPath = docLocation + "/neogallery/";
  var imageExportPath = exportPath + "img/";
  FSUtil.deleteAndCreateFolder(exportPath);
  FSUtil.createFolder(imageExportPath);
  return exportPath;
}
/**
  function for exporting all artboards of a given page.
  returns a json object of the list of images
*/
var exportArtboardsOfPage = function (doc, page, exportPath) {
  var imgConfigListForPage = [];
  var imageExportPath = exportPath + "img/";
  doc.showMessage("Exporting page: "+ page.name());
  var artboards = page.artboards()
  for (var j = 0; j < artboards.count(); j++) {
      var artboard = artboards[j];
      let filename = artboard.name() + ".png";
      doc.saveArtboardOrSlice_toFile_(scaleArtboard(artboard), imageExportPath + filename);
      imgconfig = {'imageURL': 'img/'+filename}
      imgConfigListForPage.push(imgconfig);
  }
  return imgConfigListForPage;
}
/**
  function for creating the HTML using the img list, once created it will automatically open the file using default browser
*/
var createAndOpenHTML = function (imgConfigList, exportPath, context) {
  var config = {"Images" : imgConfigList, "createdDate": currentDate()}
  var htmlString = GridHTML.getHTML(context, JSON.stringify(config));
  var someString = [NSString stringWithFormat:"%@", htmlString], filePath = exportPath+"index.html";
  [someString writeToFile:filePath atomically:true encoding:NSUTF8StringEncoding error:nil];
  var file = NSURL.fileURLWithPath(filePath);
  NSWorkspace.sharedWorkspace().openFile(file.path());
  context.document.showMessage("Artboards are exported in 'neogallery' folder next to your sketch file.");
}
/**
  function to return current date in dd MMM, YYYY format
*/
var currentDate = function () {
  var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth();
  var curr_year = d.getFullYear();
  return curr_date + " " + m_names[curr_month] + ", " + curr_year;
}
/**
  function to scale the artboard while exporting, current setting is at 2x.
*/
var scaleArtboard = function(layer) {
    var rect = layer.absoluteInfluenceRect()
    var request = [MSExportRequest new]
    request.rect = rect
    request.scale = 2; //scaling at 2x
    return request
 };

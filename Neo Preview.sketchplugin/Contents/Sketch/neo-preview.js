@import './fs-utils.js';
@import './grid-html.js';

/**
function for exporting all artboards from all pages except, Symbols, Styles and pages beginning with _
the scaling of each artboard is forced to 2x.
*/
var exportAllPages2x = function (context) {
  exportAllPages(context, '1x');
}
/**
function for exporting all artboards from all pages except, Symbols, Styles and pages beginning with _
the scaling of each artboard is taken from each artboards topmost export configuration.
*/
var exportAllPagesDefault = function (context) {
  exportAllPages(context, 'default');
}
/**
function for exporting all artboards from all pages except, Symbols, Styles and pages beginning with _
*/
var exportAllPages = function (context, scale) {
  var sketch = context.api();
  var app = sketch.Application();
  var doc = context.document;
  var pages = doc.pages();
  var exportPath = getExportPath(doc);
  var imgConfigList = []
  var currentPage = doc.currentPage();
  var pagenames = [];
  var imgID = {'idcount': 0};
  for (var i = 0; i < pages.count(); i++) {
      var page = pages[i];
      if (page.name() == "Symbols" || page.name().indexOf("_") == 0 || page.name() == "Styles") {
  			log('skipping page: '+page.name());
  		}
      else{
        pagenames.push(page.name())
        doc.setCurrentPage(page);
        var imgConfigListForPage = exportArtboardsOfPage(doc, scale, page, exportPath, imgID);
        imgConfigList.push(imgConfigListForPage);
      }
  }
  
  createAndOpenHTML(imgConfigList, exportPath, context, imgID.idcount);
  doc.setCurrentPage(currentPage); // since we change current page for exporting for each page, we reset here to original current page.
};
/**
function for exporting all artboards from current page.
the scaling of each artboard is forced to 2x.
*/
var exportCurrentPage2x = function (context, scale) {
  exportCurrentPage(context, '1x');
}
/**
function for exporting all artboards from current page.
the scaling of each artboard is taken from each artboards topmost export configuration.
*/
var exportCurrentPageDefault = function (context, scale) {
  exportCurrentPage(context, 'default');
}
/**
function for exporting all artboards from current page.
*/
var exportCurrentPage = function (context, scale) {
  var sketch = context.api();
  var app = sketch.Application();
  var doc = context.document;
  var exportPath = getExportPath(doc);
  var imgConfigList = [];
  var page = doc.currentPage();
  var imgID = {'idcount': 0};
  var imgConfigListForPage = exportArtboardsOfPage(doc, scale, page, exportPath, imgID);
  imgConfigList.push(imgConfigListForPage);
  createAndOpenHTML(imgConfigList, exportPath, context, imgID.idcount);
};
/**
function for deleting old export folder and creating a new one
*/
var getExportPath = function (doc) {
  var displayname = doc.displayName();
  displayname = displayname.indexOf(".sketch") > -1 ? displayname.slice(0,-7): displayname;
  var docLocation = doc.fileURL().path().split(doc.displayName())[0];
  console.log(docLocation);
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
var exportArtboardsOfPage = function (doc, scale, page, exportPath, imgID) {
  var imgConfigListForPage = [];
  var imageExportPath = exportPath + "img/";
  doc.showMessage("Exporting page: "+ page.name());
  var artboards = page.artboards();
  var imageID = imgID.idcount;
  for (var j = 0; j < artboards.count(); j++) {
      var artboard = artboards[j];
      //check if artboard is marked for export, ignore others
      if (artboard.exportOptions().exportFormats().length > 0) {
          var filename = artboard.name() + ".png";
          var artboardscale = getArtboardScale(artboard, scale);
          doc.saveArtboardOrSlice_toFile_(scaleArtboard(artboard, artboardscale), imageExportPath + filename);
          imgconfig = {'imageID': ''+imageID, 'imageURL': 'img/'+filename}
          imageID+=1;
          imgConfigListForPage.push(imgconfig);
      }
  }
  var imgConf = { 'pagename' : ''+page.name(), 'imgList' : imgConfigListForPage};
  imgID.idcount = imageID;
  return imgConf;
}
var getArtboardScale = function (artboard, scale) {
  if (scale == '2x') {
    return '2';
  }else if(scale == 'default'){
    //read from artboards top most export config
    return String(artboard.exportOptions().exportFormats()[0]).split('  ')[0];
  }else{
    return '1'; //will never happen
  }
}
/**
  function for creating the HTML using the img list, once created it will automatically open the file using default browser
*/
var createAndOpenHTML = function (imgConfigList, exportPath, context, imageCount) {
  var config = {"Images" : imgConfigList, "imageCount": imageCount, "createdDate": currentDate()}
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
var scaleArtboard = function(layer, artboardscale) {
    var rect = layer.absoluteInfluenceRect()
    var request = [MSExportRequest new]
    request.rect = rect
    // request.scale = 2; //scaling at 2x
    request.scale = artboardscale;
    return request
 };

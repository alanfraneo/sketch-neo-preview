@import './fs-utils.js';
@import './grid-html.js';

/**
function for exporting all artboards from all pages except, Symbols, Styles and pages beginning with _
the scaling of each artboard is forced to 2x.
*/
var exportAllPages2x = function (context) {
  exportAllPages(context, 2);
}
/**
function for exporting all artboards from all pages except, Symbols, Styles and pages beginning with _
the scaling of each artboard is taken from each artboards topmost export configuration.
*/
var exportAllPagesDefault = function (context) {
  exportAllPages(context);
}
/**
function for exporting all artboards from all pages except, Symbols, Styles and pages beginning with _
*/
var exportAllPages = function (context, scale) {
  var doc = require('sketch/dom').getSelectedDocument();
  var pages = doc.pages;
  var exportPath = getExportPath(doc);
  var imgConfigList = []
  var pagenames = [];
  var imgID = {'idcount': 0};
  for (var i = 0; i < pages.length; i++) {
      var page = pages[i];
      if (page.name == "Symbols" || page.name.indexOf("_") == 0 || page.name == "Styles") {
  			log('skipping page: '+page.name);
  		}
      else{
        pagenames.push(page.name);
        var imgConfigListForPage = exportArtboardsOfPage(doc, scale, page, exportPath, imgID);
        imgConfigList.push(imgConfigListForPage);
      }
  }  
  createAndOpenHTML(imgConfigList, exportPath, context, imgID.idcount);
};
/**
function for exporting all artboards from current page.
the scaling of each artboard is forced to 2x.
*/
var exportCurrentPage2x = function (context, scale) {
  exportCurrentPage(context, 2);
}
/**
function for exporting all artboards from current page.
the scaling of each artboard is taken from each artboards topmost export configuration.
*/
var exportCurrentPageDefault = function (context, scale) {
  exportCurrentPage(context);
}
/**
function for exporting all artboards from current page.
*/
var exportCurrentPage = function (context, scale) {
  var doc = require('sketch/dom').getSelectedDocument();
  var exportPath = getExportPath(doc);
  var imgConfigList = [];
  var page = doc.selectedPage;
  var imgID = {'idcount': 0};
  var imgConfigListForPage = exportArtboardsOfPage(doc, scale, page, exportPath, imgID);
  imgConfigList.push(imgConfigListForPage);
  createAndOpenHTML(imgConfigList, exportPath, context, imgID.idcount);
};
/**
function for deleting old export folder and creating a new one
*/
var getExportPath = function (doc) {
  var docLocation = decodeURI(doc.path).split('/').slice(0,-1).join('/');
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
  var UI = require('sketch/ui')
  var sketch = require('sketch/dom')
  var imgConfigListForPage = [];
  var imageExportPath = exportPath + "img/";
  UI.message("Exporting page: "+ page.name);
  var artboards = page.layers.filter(l => l.type == 'Artboard');
  var imageID = imgID.idcount;
  for (var j = 0; j < artboards.length; j++) {
      var artboard = artboards[j];
      //check if artboard is marked for export, ignore others
      if (artboard.exportFormats.length > 0) {
          if (scale == undefined) {
            scale = artboard.exportFormats[0].size.replace('x','')
          }
          var fileFormat = artboard.exportFormats[0].fileFormat;
          var filename = artboard.name + ".png";
          if (scale > 1) {
              filename = artboard.name +'@'+scale+"x."+artboard.exportFormats[0].fileFormat;
          }
          options = {formats: fileFormat, scales: scale, output: imageExportPath}
          sketch.export(artboard, options);
          imgconfig = {'imageID': ''+imageID, 'imageURL': 'img/'+filename}
          imageID+=1;
          imgConfigListForPage.push(imgconfig);
      }
  }
  var imgConf = { 'pagename' : ''+page.name, 'imgList' : imgConfigListForPage};
  imgID.idcount = imageID;
  return imgConf;
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
  var UI = require('sketch/ui')
  UI.message("Artboards are exported in 'neogallery' folder next to your sketch file.");
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

/* jshint esversion: 6 */

window.onload = function() {
    NeoGallery.initNeoGallery();
}

var NeoGallery = new function() {

    this.getfullImgList = function(){
        var fullImgList = [];
        for (i in imgconfig.Images){
          if (imgconfig.Images[i].hasOwnProperty("imgList")) {
            fullImgList = fullImgList.concat(imgconfig.Images[i].imgList)  
          }
        }
        return fullImgList;
    };

    this.fullImageList = this.getfullImgList();

    this.initNeoGallery = function() {
        NeoGallery.renderGallery(imgconfig);
        NeoGallery.handleHashChange();
        window.onhashchange = NeoGallery.handleHashChange;
    };

    this.changeTab = function(evt) {
        document.getElementsByClassName('active')[0].classList.remove('active');
        evt.classList.add('active');
        NeoGallery.renderGalleryforTab(imgconfig, evt.innerHTML);
    };


    this.renderTabs = function(json){
      var images = json.Images;
      var tabs = [];
      for (var i in images){
        if (images[i].hasOwnProperty('pagename')) {
          tabs.push(images[i].pagename);
        }
      }
      var tabHTML = ``;
      if(tabs.length > 0){
        for (var tab in tabs){
          if (tab == 0) {
            tabHTML += `<li onclick="NeoGallery.changeTab(this)" class='active'>${tabs[tab]}</li>`
          }else{
            tabHTML += `<li onclick="NeoGallery.changeTab(this)">${tabs[tab]}</li>`
          }
        }
      }
      document.getElementById('tabs').innerHTML = tabHTML;
    };

    this.renderGallery = function(json) {
        NeoGallery.renderTabs(json);
        var images = json.Images;
        document.getElementById("title").innerHTML = `<div class='createdon'>Images uploaded on: ${json.createdDate}</div><div class='createdon'>Click on an image to see full screen</div>`;
        document.body.innerHTML += `<div id="prevBtn" class="control previous" onclick='NeoGallery.controls(this)'>
                            </div><div id="nextBtn" class="control next" onclick='NeoGallery.controls(this)'></div>`;
        document.body.style.backgroundColor = '#212121';
        NeoGallery.renderGalleryforTab(json, images[0].pagename)
        document.addEventListener('keydown', NeoGallery.bindKeyboardShortcuts);
    };

    this.renderGalleryforTab = function (json, tabname) {
        document.getElementById("neogallery").innerHTML = "";
        var images = json.Images;
        for (var i in images){
            if(images[i].hasOwnProperty('pagename') && images[i].pagename == tabname){
                for (var j in images[i].imgList){
                  document.getElementById("neogallery").innerHTML +=
                        `<div class='imageHolder'>
                            <img id='img-${images[i].imgList[j].imageID}' src='${images[i].imgList[j].imageURL}' class='gridimg' onclick='NeoGallery.maximizeImage(this)'>
                            <span class='titletext'>${parseInt(images[i].imgList[j].imageID)+1}</span>
                        </div>`;
                }
                    
            }
        }      
    }

    this.controls = function(el) {
        var nextImgNumber = parseInt(document.getElementById("maxedImage").attributes['current-img'].value);
        if (el.attributes['id'].value == 'prevBtn') {
            nextImgNumber -= 1;
        } else if (el.attributes['id'].value == 'nextBtn') {
            nextImgNumber += 1;
        }
        NeoGallery.setMaxImage(nextImgNumber);
    };

    this.bindKeyboardShortcuts = function (e) {
        if (document.getElementById('maxedImage')) {
            switch (e.keyCode) {
                case 37: // left
                    document.getElementById("prevBtn").click();
                    break;

                case 39: // right
                    document.getElementById("nextBtn").click();
                    break;

                case 27: // esc
                    NeoGallery.closeLargeImage();
                    break;

                default:
                    return; // exit this handler for other keys
            }
        }
        e.stopPropagation(); // prevent the default action (scroll / move caret)
    };

    this.handleHashChange = function() {
        if (window.location.hash != '#' && window.location.hash != '') {
            imgNumber = window.location.hash.split("#")[1];
            imgToClick = parseInt(imgNumber) - 1;
            NeoGallery.setMaxImage(imgToClick);
        }
        else{ //no hash in UI, so close the maxed image if it exists
            NeoGallery.closeLargeImage();
        }
    };

    this.getImgURL = function(imgId){
      return NeoGallery.fullImageList.filter(function(image){return image.imageID == imgId})[0].imageURL;
    };

    this.setMaxImage = function(nextImgNumber) {
        if(nextImgNumber >=0 && nextImgNumber < parseInt(imgconfig.imageCount)){
            NeoGallery.hideGallery(nextImgNumber);
            document.body.innerHTML += `<div id='maxedImage' current-img='${nextImgNumber}'>
                                          <img src='${NeoGallery.getImgURL(nextImgNumber)}'>
                                        </div>`;
            document.getElementById("maxedImage").innerHTML = '';
            document.getElementById("maxedImage").setAttribute('current-img', nextImgNumber);
            document.getElementById("maxedImage").innerHTML += `<img src='${NeoGallery.getImgURL(nextImgNumber)}'>`;
            document.getElementById("maxedImage").addEventListener('click', NeoGallery.closeLargeImage);
            window.scrollTo(0, 0);
            window.location.hash = '#' + (nextImgNumber + 1);
        }
    };

    this.hideGallery = function(imgNumber){
        document.getElementsByClassName("control").show();
        if (imgNumber ==0) document.getElementById("prevBtn").hide();
        if (imgNumber == parseInt(imgconfig.imageCount)-1) document.getElementById("nextBtn").hide();
        if(document.getElementById("maxedImage")) document.getElementById("maxedImage").remove();
        document.getElementById("neogallery").hide();
        document.getElementById("title").hide();      
    }

    this.maximizeImage = function(el) {
        var currentImg = parseInt(el.attributes['id'].value.split('-')[1]);
        NeoGallery.hideGallery(currentImg);
        document.body.innerHTML += `<div id='maxedImage' current-img='${currentImg}'>
                                      <img src='${NeoGallery.getImgURL(currentImg)}'>
                                    </div>`;
        window.location.hash = '#' + (currentImg + 1);
        document.getElementById("maxedImage").addEventListener('click', NeoGallery.closeLargeImage);
        window.scrollTo(0, 0);
    };

    this.removeHash = function () {
        history.replaceState("", document.title, window.location.pathname + window.location.search);
    };

    this.closeLargeImage = function () {
        if(document.getElementById("maxedImage")) document.getElementById("maxedImage").remove();
        document.getElementById("neogallery").show();
        document.getElementById("title").show();
        document.getElementsByClassName("control").hide();
        NeoGallery.removeHash();
    };

    this.ajaxGet = function(url, success) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open('GET', url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState>3 && xhr.status==200) {
                success(xhr.responseText);
            }else if (xhr.readyState>3 && xhr.status!=200){
                alert("error while fetching: "+url);
            }
        };
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send();
        return xhr;
    };
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
Element.prototype.hide = function() {
    this.style.display = 'none';
}
Element.prototype.show = function() {
    this.style.display = 'block';
}
NodeList.prototype.hide = HTMLCollection.prototype.hide = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        this[i].style.display = 'none';
    }
}
NodeList.prototype.show = HTMLCollection.prototype.show = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        this[i].style.display = 'block';
    }
}

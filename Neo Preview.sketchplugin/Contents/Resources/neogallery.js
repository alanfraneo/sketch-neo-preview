window.onload = function() {
    NeoGallery.initNeoGallery();
}

var NeoGallery = new function() {

    this.initNeoGallery = function() {
        NeoGallery.renderGallery(imgconfig);
        NeoGallery.handleHashChange();
        window.onhashchange = NeoGallery.handleHashChange;
    }

    this.renderGallery = function(json) {
        var images = json.Images;
        document.getElementById("title").innerHTML = `<div class='createdon'>Images uploaded on: ${json.createdDate}</div><div class='createdon'>Click on an image to see full screen</div>`;
        document.body.innerHTML +=   `<div id="prevBtn" class="control previous" onclick='NeoGallery.controls(this)'>
                            </div><div id="nextBtn" class="control next" onclick='NeoGallery.controls(this)'></div>`;
        document.body.style.backgroundColor = '#212121';
        for (var i in images){
            if(images.hasOwnProperty(i)){
            document.getElementById("neogallery").innerHTML +=
                        `<div class='imageHolder'>
                            <img id='img-${i}' src='${images[i].imageURL}' class='gridimg' onclick='NeoGallery.maximizeImage(this)'>
                            <span class='titletext'>${parseInt(i)+1}</span>
                        </div>`;
            }
        }

        document.addEventListener('keydown', NeoGallery.bindKeyboardShortcuts);
    }

    this.controls = function(el) {
        console.log(el)
        var nextImgNumber = parseInt(document.getElementById("maxedImage").attributes['current-img'].value);
        if (el.attributes['id'].value == 'prevBtn') {
            nextImgNumber -= 1;
        } else if (el.attributes['id'].value == 'nextBtn') {
            nextImgNumber += 1;
        }
        NeoGallery.setMaxImage(nextImgNumber);
    }

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
        e.preventDefault(); // prevent the default action (scroll / move caret)
    };

    this.handleHashChange = function() {
		if (window.location.hash != '#' && window.location.hash != '') {
            imgNumber = window.location.hash.split("#")[1];
            imgToClick = parseInt(imgNumber) - 1;
            document.getElementById("img-" + imgToClick).click();
            console.log("load img-" + imgNumber);
        }
        else{ //no hash in UI, so close the maxed image if it exists
        	NeoGallery.closeLargeImage()
        }
    }

    this.setMaxImage = function(nextImgNumber) {
        var nextImgId = 'img-' + nextImgNumber;
        if (document.getElementById(nextImgId)) {
            document.getElementById("maxedImage").innerHTML = '';
            document.getElementById("maxedImage").setAttribute('current-img', nextImgNumber);
            document.getElementById("maxedImage").innerHTML += `<img src='${document.getElementById(nextImgId).src}'>`;
            window.location.hash = '#' + (nextImgNumber + 1);
        }
    }

    this.maximizeImage = function(el) {
        console.log(el);
        document.getElementsByClassName("control").show();
        if(document.getElementById("maxedImage")) document.getElementById("maxedImage").remove();
        document.getElementById("neogallery").hide();
        document.getElementById("title").hide();
        var currentImg = el.attributes['id'].value.split('-')[1];
        document.body.innerHTML += `<div id='maxedImage' current-img='${currentImg}'>
                                <img src='${el.attributes['src'].value}'>
                           </div>`;
        window.location.hash = '#' + (parseInt(currentImg) + 1);
        document.getElementById("maxedImage").addEventListener('click', NeoGallery.closeLargeImage);
    }

    this.removeHash = function () {
        history.replaceState("", document.title, window.location.pathname + window.location.search);
    }

    this.closeLargeImage = function () {
        if(document.getElementById("maxedImage")) document.getElementById("maxedImage").remove();
        document.getElementById("neogallery").show();
        document.getElementById("title").show();
        document.getElementsByClassName("control").hide();
        NeoGallery.removeHash();
    }

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
    }
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

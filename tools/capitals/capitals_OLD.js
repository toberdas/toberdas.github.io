var srcar = [];
var url = window.location.href;

fetch(url.replace("html/capitals.html", "tools/capitals/srcar.txt"), {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'no-cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'omit', // include, *same-origin, omit
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  })
    .then(response => response.text())
    .then((data) => {
        srcar = JSON.parse(data);
    });

var drawArray = [];

function loadImages(){
    
    drawArray = [];
    var inputString = document.getElementById("inputText").value;
    //first pass through letters in inputstring to make images, set source and add them to drawarray
    for (i = 0; i < inputString.length; i++){
        //pass through source array
        for (j = 0; j < srcar.length; j++){
            var fileString = srcar[j].charAt(0); //only look at first character of sourcefile, containing the letter the user is looking for
            //if the sourcefile letter and current letter from the input are the same
            if (fileString.localeCompare(inputString.charAt(i)) == 0){
                //create new image and start loading it
                var img = new Image();
                img.src = url.replace("html/capitals.html", "tools/capitals/pngfiles/" + srcar[j]);
                //put the image in drawarray for drawing when they are loaded
                drawArray.push(img);
                break;
            };
        };
    };
    setTimeout('checkLoad()', 5);
};

function checkLoad(){    
    var complete = true;
    for (i = 0; i < drawArray.length; i++){
        if (!drawArray[i].complete){
            complete = false;
        }
    };
    if (!complete){
        setTimeout('checkLoad()', 5);
    }
    else{
        loadCanvas();
    }
}

function loadCanvas(){
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var workingWidth = 0;
    var workingHeight = 0;
    canvas.width = 0;
    canvas.height = 0;
    var lastMaxHeight = 0;  //used to track the max height of the images
    var spaceWidth = 0; //used to track spacewidth
    for (i = 0; i < drawArray.length; i++){
        workingWidth += drawArray[i].width;
        spaceWidth = drawArray[i].width;
        if (drawArray[i].height >= lastMaxHeight){
            workingHeight = drawArray[i].height; 
            lastMaxHeight = drawArray[i].height;
        };
    };
    canvas.width = workingWidth;
    canvas.height = workingHeight;
    drawImages(context);
};

function drawImages(context){
    var xdraw = 0;          //used to track the x location within the canvas to draw new images
    //second pass through array containing images, draw in an enclosed loop when they are loaded
    drawArray.forEach(function(value,i) {
            context.drawImage(value, xdraw, (canvas.height - value.height) * 0.5);
            xdraw += value.width;
    });
}
var srcar = [];
var drawArray = [];

function onTranslateClick(){
    var url = window.location.href;
    let style = document.querySelector('input[name="capitals-style"]:checked').value;
    let newurl = url.replace("html/capitals", "tools/capitals/pngfiles/" + style);
    newurl = url.replace("html/capitals.html", "tools/capitals/pngfiles/" + style);
    loadImages(newurl)

}

function resolved(image){
    drawArray.push(image)
}

function rejected(reason){
    loadImage()
}

// async function loadImages(newurl){
//     drawArray = [];
//     var inputString = document.getElementById("inputText").value;
//     //first pass through letters in inputstring to make images, set source and add them to drawarray
//     for (i = 0; i < inputString.length; i++){
//             let letterurl = newurl + "/" + inputString.charAt(i) + ".png"
//         //await img at url to load
//         // await loadImage(newurl + "/" + inputString.charAt(i) + ".png")
//         // .then(img => drawArray.push(img));
//             await loadImage(letterurl)
//             .then(resolved)
//             .catch(async (reason) => {
//                 console.log('trying in lowercase with _1')
//                 await loadImage(newurl + "/" + inputString.charAt(i) + "_1" + ".png")
//                 .then(resolved)
//             })
//             .catch(async (reason) => {
//                 console.log('trying in uppercase')
//                 await loadImage(newurl + "/" + inputString.charAt(i).toUpperCase() + ".png")
//                 .then(resolved)
//             })
//             .catch(async (reason) => {
//                 console.log('trying in uppercase with _1')
//                 await loadImage(newurl + "/" + inputString.charAt(i).toUpperCase() + "_1" + ".png")
//                 .then(resolved)
//             })
        
//         }
//     loadCanvas();
// };

async function loadImages(newurl){
    drawArray = [];
    var inputString = document.getElementById("inputText").value;
    //first pass through letters in inputstring to make images, set source and add them to drawarray
    for (i = 0; i < inputString.length; i++){
            if (inputString.charAt(i) !== " "){
                let letterurl = newurl + "/" + inputString.charAt(i) + ".png"

                await loadImage(letterurl)
                .then(resolved)
                .catch(async (reason) => {
                    console.log('trying in lowercase with _1')
                    await loadImage(newurl + "/" + inputString.charAt(i) + "_1" + ".png")
                    .then(resolved)
                })
                .catch(async (reason) => {
                    console.log('trying in uppercase')
                    await loadImage(newurl + "/" + inputString.charAt(i).toUpperCase() + ".png")
                    .then(resolved)
                })
                .catch(async (reason) => {
                    console.log('trying in uppercase with _1')
                    await loadImage(newurl + "/" + inputString.charAt(i).toUpperCase() + "_1" + ".png")
                    .then(resolved)
                })
                .catch(reason => {alert("This set doesn't contain: " + inputString.charAt(i))})
            }
            else{
                drawArray.push(0)
            }
        
        }
    loadCanvas();
};


function loadImage(url) {
    return new  Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
            
        });
        image.addEventListener('error', () =>{
            reject('image not found')
        })
        image.src = url; 
    });
}

// function loadImage(url) {
//     return new  Promise(resolve => {
//         const image = new Image();
//         image.addEventListener('load', () => {
//             resolve(image);
//         });
//         image.src = url; 
//     });
// }

// function loadCanvas(){
//     var canvas = document.getElementById('canvas');
//     var context = canvas.getContext('2d');
//     var workingWidth = 0;
//     var workingHeight = 0;
//     canvas.width = 0;
//     canvas.height = 0;
//     var lastMaxHeight = 0;  //used to track the max height of the images
//     var spaceWidth = 0; //used to track spacewidth
//     for (i = 0; i < drawArray.length; i++){
//         workingWidth += drawArray[i].width;
//         spaceWidth = drawArray[i].width;
//         if (drawArray[i].height >= lastMaxHeight){
//             workingHeight = drawArray[i].height; 
//             lastMaxHeight = drawArray[i].height;
//         };
//     };
//     canvas.width = workingWidth;
//     canvas.height = workingHeight;
//     drawImages(context);
// };

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
        if (drawArray[i] !== 0)
        {
            workingWidth += drawArray[i].width;
            spaceWidth = drawArray[i].width;
            if (drawArray[i].height >= lastMaxHeight){
                workingHeight = drawArray[i].height; 
                lastMaxHeight = drawArray[i].height;
            };
        }
        else{
            workingWidth += spaceWidth;
        }
    };
    canvas.width = workingWidth;
    canvas.height = workingHeight;
    drawImages(context);
};

// function drawImages(context){
//     var xdraw = 0;          //used to track the x location within the canvas to draw new images
//     //second pass through array containing images, draw in an enclosed loop when they are loaded
//     drawArray.forEach(function(value,i) {

//             context.drawImage(value, xdraw, (canvas.height - value.height) * 0.5);
//             xdraw += value.width;
//     });
// }

function drawImages(context){
    var xdraw = 0;          //used to track the x location within the canvas to draw new images
    //second pass through array containing images, draw in an enclosed loop when they are loaded
    drawArray.forEach(function(value,i) {
            if (value !== 0){
                context.drawImage(value, xdraw, (canvas.height - value.height) * 0.5);
                xdraw += value.width;
            }
            else{
                xdraw += 48;
            }
    });
}

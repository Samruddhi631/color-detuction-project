const canvas = document.createElement("canvas");
const ctx= canvas.getContext("2d");
const myImage = document.getElementById("myImage");
const xMin = 0,xMax=255;
const yMin = 0,yMax=255;
const zMin = 0,zMax=255;
let customAlert = document.getElementById("custom-alert");
imageInput.addEventListener("change",function(){
    let file = this.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
        myImage.src = e.target.result;
        let image = new Image();
        image.src = myImage.src;
        image.addEventListener("load",function(){
            generateColorPalette(image);
            canvas.getContext("2d").drawImage(img, 0, 0, img.width,    img.height, 0, 0, canvas.width, canvas.height);
            colorhover(image);
        })
    }
    reader.readAsDataURL(file);
})

function generateColorPalette(img){
    let colors = getImageColors(img);
    const cubeSize = 110;
    let topDensityCubes = findTopDensityCubes(colors,cubeSize);
    const centersOfMass = topDensityCubes.map(([i,j,k])=>{
        const rMin = i*cubeSize+xMin;
        const rMax = rMin+cubeSize;
        const gMin = j*cubeSize+yMin;
        const gMax = gMin+cubeSize;
        const bMin = k*cubeSize+zMin;
        const bMax = bMin + cubeSize;
        const cubeColors = colors.filter(([r,g,b])=>
            r>=rMin && r<rMax &&
            g>=gMin && g<gMax &&
            b>=bMin && b<bMax
        );
        const sum = cubeColors.reduce(([rSum,gSum,bSum],[r,g,b])=>[
            rSum + r,
            gSum + g,
            bSum + b
        ],[0,0,0]);
        return sum.map(x=>x/cubeColors.length);
    });

    fillColorPalette(centersOfMass);
}

function findTopDensityCubes(colors,cubeSize,n=12){
    const xLength = Math.ceil((xMax-xMin)/cubeSize);
    const yLength = Math.ceil((yMax-yMin)/cubeSize);
    const zLength = Math.ceil((zMax-zMin)/cubeSize);
    const counts = new Array(xLength);
    for (let i=0;i<xLength;i++){
        counts[i] = new Array(xLength);
        for(let j=0;j<yLength;j++){
            counts[i][j] = new Array(zLength).fill(0);
        }
    }
    for (let p=0;p<colors.length;p++){
        const [r,g,b] = colors[p];
        const i= Math.floor((r-xMin)/cubeSize);
        const j= Math.floor((g-yMin)/cubeSize);
        const k= Math.floor((b-zMin)/cubeSize);

        counts[i][j][k]++;
    }
    let indicesAndCounts = [];
    for (let i=0;i<xLength;i++){
        for (let j=0;j<yLength;j++){
            for (let k=0;k<zLength;k++){
                indicesAndCounts.push({index:[i,j,k],count:counts[i][j][k]});
            }
        }
    }
    indicesAndCounts.sort((a,b)=>b.count-a.count);
    return indicesAndCounts.slice(0,n).map(x=>x.index);
}

function getImageColors(img){
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img,0,0);
    const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    const data = imageData.data;
    const imageColors = [];
    for (let i=0;i<data.length;i+=4){
        const r=data[i];
        const g=data[i+1];
        const b = data[i+2];
        imageColors.push([r,g,b]);
    }
    return imageColors;
}

function fillColorPalette(centersOfMass){
    let colorCount = centersOfMass.reduce((acc,rgb)=>acc+rgb.every(value=>isNaN(value)),0);

    for(let i=1;i<=centersOfMass.length;i++){
        let divId = "cluster"+i;
        let div = document.getElementById(divId);
        let color = centersOfMass[i-1];
        div.style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]})`;
        div.title = `rgb(${Math.round(color[0])},${Math.round(color[1])},${Math.round(color[2])})`;
        if(isNaN(color[0]))
            div.style.width = "0%";
        else
         div.style.width = (100/(12-colorCount))+"%";
    }
}
// Mousemove event listener to display color name
// document.getElementById('myImage').addEventListener('mousemove', function (event) {
//     const colorInfo = document.getElementById('color-info');
//     const image = document.getElementById('myImage');

//     const canvas = document.createElement('canvas');
//     canvas.width = image.width;
//     canvas.height = image.height;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(image, 0, 0, image.width, image.height);

//     const x = event.offsetX;
//     const y = event.offsetY;

//     const pixel = ctx.getImageData(x, y, 1, 1).data; 
//    const rgb = `${pixel[0]},${pixel[1]},${pixel[2]}`;

//     colorInfo.textContent = `Color at (${x}, ${y}): RGB(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
//     colorInfo.style.backgroundColor= colorInfo.pixel ;
//     // fillColor(centersOfMass)
        

// });
// Mousemove event listener to display color name
// document.getElementById('myImage').addEventListener('mousemove', function (event) {
//     const colorInfo = document.getElementById('color-info');
//     const image = document.getElementById('myImage');

//     const canvas = document.createElement('canvas');
//     canvas.width = image.width;
//     canvas.height = image.height;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(image, 0, 0, image.width, image.height);

//     const x = event.offsetX;
//     const y = event.offsetY;

//     const pixel = ctx.getImageData(x, y, 1, 1).data; 
// //    const rgb = `${pixel[0]},${pixel[1]},${pixel[2]}`;

//     colorInfo.textContent = `Color at (${x}, ${y}): RGB(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
//     colorInfo.style.backgroundColor= colorInfo.pixel ;
//     // fillColor(centersOfMass)
        

// });
// function fillColor(centersOfMass){
//     let colorCount = centersOfMass.reduce((acc,rgb)=>acc+rgb.every(value=>isNaN(value)),0);

//         let divId = "cluster";
//         let div = document.getElementById(divId);
//         let color = colorInfo;
//         div.fillStyle.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]})`;
//         if(isNaN(color[0]))
//             div.style.width = "0%";
//         else
//          div.style.width = (100/(12-colorCount))+"%";
    
// }
// document.getElementById("start-button").addEventListener("click", () => {
//     const resultElement = document.getElementById("result");
  
//     if (!window.EyeDropper) {
//       resultElement.textContent =
//         "Your browser does not support the EyeDropper API";
//       return;
//     }
  
//     const eyeDropper = new EyeDropper();
  
//     eyeDropper
//       .open()
//       .then((result) => {
//         resultElement.textContent = result.sRGBHex;
//         resultElement.style.backgroundColor = result.sRGBHex;
//       })
//       .catch((e) => {
//         resultElement.textContent = e;
//       });
//   });
  


function getElementPosition(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function getEventLocation(element,event){
		var pos = getElementPosition(element);
    
    return {
    		x: (event.pageX - pos.x),
      	y: (event.pageY - pos.y)
    };
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

// imageInput.addEventListener("change",function(){
//     let file = this.files[0];
//     let reader = new FileReader();
//     reader.onload = function(e) {
//         myImage.src = e.target.result;
//         let image = new Image();
//         image.src = myImage.src;
//         image.addEventListener("load",function(){
//             canvas.getContext("2d").drawImage(img, 0, 0, img.width,    img.height, 0, 0, canvas.width, canvas.height);
        
//         })
//     }
//     reader.readAsDataURL(file);
// })
// function colorhover(img){
// canvas.addEventListener("mousemove",function(e){
//     var eventLocation = getEventLocation(this,e);
//   var coord = "x=" + eventLocation.x + ", y=" + eventLocation.y;
  
//   // Get the data of the pixel according to the location generate by the getEventLocation function
//   var context = this.getContext('2d');
//   var pixelData = context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data; 

//   // If transparency on the image
//   if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0)){
//                coord += " (Transparent color detected, cannot be converted to HEX)";
//   }
  
//   var hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
  
//   // Draw the color and coordinates.
//   document.getElementById("status").innerHTML = coord;
//   document.getElementById("color").style.backgroundColor = hex;
// },false);}

let copy = (textId) => {
    //Selects the text in the <input> element
    document.getElementById(textId).select();
    //Copies the selected text to clipboard
    document.execCommand("copy");
    //Display Alert
    customAlert.style.transform = "scale(1)";
    setTimeout(() => {
      customAlert.style.transform = "scale(0)";
    }, 2000);
  };
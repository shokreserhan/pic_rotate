const PIC_SIZE = 60;

var imageNumber = 0;
var selectedImg = null;
var selectedCanvas = null;

if (window.File && window.FileList && window.FileReader) {

    function showFile() {

        var input = document.createElement('input');
        input.type = 'file';
        input.accept = "image/*";
        var preview = document.getElementById("preview");
        var fileInput = document.querySelector("input[type=file]");

        for (var i = 0; i < fileInput.files.length; i++) {
            var reader = new FileReader();
            reader.onload = function(readerEvent) {

                var listItem = document.createElement("div");
                var imgTop = Math.random() * (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - PIC_SIZE;
                var imgLeft = Math.random() * (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - PIC_SIZE;

                if(selectedCanvas != null){
                    selectedCanvas.style.border = 'none';
                }

                listItem.innerHTML = "<img id = "+imageNumber+" style = top:"+imgTop+"px; left:"+imgLeft+"px; class = smallImg src='" + readerEvent.target.result + "' /><canvas style = top:"+imgTop+"px; left:"+imgLeft+"px; height:60px; width:60px; class = canvasOutput id = canvasOutput-"+imageNumber+" ></canvas>";
                imageNumber++;
                preview.append(listItem);
                selectedImg = listItem.children[listItem.children.length-2];
                selectedCanvas = listItem.lastChild;
                selectedCanvas.style.border = '2px solid blue';

            }
            reader.readAsDataURL(fileInput.files[i]);
        }
        const dt = new DataTransfer();
        fileInput.files = dt.files;
    }

} else {
    alert("Your browser is too old to support HTML5 File API");
}

$(document).on('click', 'canvas', function() {
    alert('Click on canvas id: '+$(this).attr('id'));
    if(selectedCanvas){
        selectedCanvas.style.border = 'none';
    }
    this.style.border = '2px solid blue';
    selectedCanvas = this;
    selectedImg = this.previousSibling;
});

$(document).on('click', '.LEFT', function() {
    rotate(1);
});

$(document).on('click', '.RIGHT', function() {
    rotate(-1);
});

function rotate(direction){
    let angel = parseFloat(document.getElementById("angel").value);
    selectedImg.style.visibility = 'hidden';
    let src = cv.imread(selectedImg);
    let dst = new cv.Mat();
    let dsize = new cv.Size(src.rows, src.cols);
    let center = new cv.Point(src.cols / 2, src.rows / 2);
    let M = cv.getRotationMatrix2D(center, direction*angel, 1);
    cv.warpAffine(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
    cv.imshow(selectedCanvas, dst);
    src.delete(); dst.delete(); M.delete();
}
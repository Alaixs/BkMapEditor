const canvas = document.getElementById("editor");
const context = canvas.getContext("2d");
const gridCheckbox = document.getElementById("gridCheckbox");
let blockPreview = document.getElementById('block-preview');
let grid = [];
let selectedTool = "BWALL";
let isSave = true;
let isPlacing = false;
drawGrid();

///////////////////
//  SAVE CHECKER //
///////////////////

window.addEventListener('beforeunload', function(e) {
    if(isSave == false)
    {
    e.preventDefault();

    }
});


/////////////////////
//  PLACE & UPDATE //
/////////////////////

for (let i = 0; i < 30; i++) {
    grid.push([])
    for (let j = 0; j < 30; j++) {
        grid[i].push(0);
    }
}


function placeElement(e) {
  if (e.buttons) {
      if (selectedTool == "WALL") {
          grid[Math.floor(e.offsetY / 32)][Math.floor(e.offsetX / 32)] = 1;
      }
      else if (selectedTool == "BWALL") {
          grid[Math.floor(e.offsetY / 32)][Math.floor(e.offsetX / 32)] = 2;
      }
      else if (selectedTool == "ERASE") {
          grid[Math.floor(e.offsetY / 32)][Math.floor(e.offsetX / 32)] = 0;
      }
      isSave = false;
      updateDisplay();
  }
}

canvas.addEventListener("mousedown", () => {
  isPlacing = true;
});

canvas.addEventListener("mouseup", () => {
  isPlacing = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (isPlacing) {
    placeElement(e);
  }
});

Math.roundTo = function(num, step) {

    return Math.floor((num / step) + .5) * step;
}


function updateDisplay() {
    context.clearRect(0, 0, 960, 960);
    for (let i = 0; i < 30; i++)
    {
        for (let j = 0; j < 30; j++)
        {
            if (grid[i][j] == 1)
            {
                context.fillStyle = "#4C3D3D";
                context.drawImage(document.querySelector("#img_wall"), j*32, i*32, 32, 32);
            }
            if (grid[i][j] == 2)
            {
                context.fillStyle = "#C07F00";
                context.drawImage(document.querySelector("#img_bwall"), j*32, i*32, 32, 32);
            }
        }
    }
    if(gridCheckbox.checked)
    {
        drawGrid();
    }
}


function switchTool(tool) {
    const images = document.querySelectorAll(".element-selector");
    images.forEach((image) => {
      image.classList.remove("selected-tool");
    });
  
    const selectedImage = document.querySelector(`.element-selector[data-tool="${tool}"]`);
    selectedImage.classList.add("selected-tool");
  

    selectedTool = tool;

    blockPreview = document.getElementById('block-preview');
    if (tool === "WALL") {
        console.log("WALL");
      blockPreview.src = "t_32unbreakable_wall.png";
    } else if (tool === "BWALL") {
      blockPreview.src = "t_32breakable_wall.png";
    } else if (tool === "ERASE") {
      blockPreview.src = "t_32erase.png";
    }
  }
  

  ///////////////////////
  //  DOWNLOAD & SAVE  //
  ///////////////////////

const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    
    a.href= URL.createObjectURL(file);
    a.download = filename;
    a.click();
  
      URL.revokeObjectURL(a.href);

};


function save()
{
    let result = "";

    for (let i = 0; i < 30; i++) {
        result += grid[i].map(value => value || 0).join(",");
        result += "\n";
      }

    let mapName = document.querySelector('#filename').value;
    if (mapName == "")
    {
        mapName = "my_map";
    }

    downloadToFile(result, `${mapName}.bkmap`, 'text/plain');
    isSave = true;
}

function readFileContent() {
    let fileInput = document.getElementById('fileInput');
    let file = fileInput.files[0];
    let reader = new FileReader();
    
    
    if(!file.name.endsWith(".bkmap"))
    {
        alert("This is not a .bkmap file !");
        return;
    }
  
    reader.onload = function(e) {
      let contents = e.target.result;
        let lines = contents.split("\n");
        for (let i = 0; i < 30; i++)
        {
            grid[i] = lines[i].split(",");
        }
        updateDisplay();
        
  
      isSave = true;
    };
  
    reader.readAsText(file);
    const fileName = document.getElementById('fileName');

    if (fileInput.files.length > 0) {
      fileName.textContent = fileInput.files[0].name;
    } else {
      fileName.textContent = 'Choose a file';
    }
  }


  ///////////////////////
  //   MOUSE PREVIEW   //
  ///////////////////////

  document.addEventListener('DOMContentLoaded', () => {
    const canvasContainer = document.getElementById('editor');
  
    canvasContainer.addEventListener('mouseenter', (e) => {
      canvasContainer.style.cursor = 'none'; 
      blockPreview.style.display = 'inline';
      blockPreview.style.left = (-15 + e.pageX) + 'px';
      blockPreview.style.top = (-15 + e.pageY) + 'px';
    });
  
    canvasContainer.addEventListener('mousemove', (e) => {
      blockPreview.style.left = (-15 + e.pageX) + 'px';
      blockPreview.style.top = (-15 + e.pageY) + 'px';
    });
  
    canvasContainer.addEventListener('mouseleave', () => {
      blockPreview.style.display = 'none';
    });
  });


  function drawGrid() {
    if(!gridCheckbox.checked)
    {
        updateDisplay();
        return;
    }
    const gridSize = 32;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
  
    context.strokeStyle = "#888";
    context.lineWidth = 1;
  
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvasHeight);
      context.stroke();
    }
  
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvasWidth, y);
      context.stroke();
    }
  }
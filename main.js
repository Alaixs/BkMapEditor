var canvas = document.getElementById("editor");
var context = canvas.getContext("2d");



var grid = [];
var selectedTool = "WALL";


for (let i = 0; i < 30; i++) {
    grid.push([])
    for (let j = 0; j < 30; j++) {
        grid[i].push(0);
    }
}


function placeElement(e) {
    if (selectedTool == "WALL") {
        grid[Math.floor(e.offsetY / 32)][Math.floor(e.offsetX / 32)] = 1;
    }
    else if (selectedTool == "BWALL") {
        grid[Math.floor(e.offsetY / 32)][Math.floor(e.offsetX / 32)] = 2;
    }
    else if (selectedTool == "ERASE") {
        grid[Math.floor(e.offsetY / 32)][Math.floor(e.offsetX / 32)] = 0;
    }
    updateDisplay();
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

}


function switchTool(tool)
{
    selectedTool = tool;
}


Math.roundTo = function(num, step) {

    return Math.floor((num / step) + .5) * step;
    
}

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

    for (let i = 0; i < 30; i++)
    {
        result += grid[i];
        result += "\n";
    }

    let mapName = document.querySelector('#filename').value;
    if (mapName == "")
    {
        mapName = "my_map";
    }

    downloadToFile(result, `${mapName}.bkmap`, 'text/plain');
}
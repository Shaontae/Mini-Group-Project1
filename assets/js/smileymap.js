let mapRow1=["blank", "blank", "blank", "blank", "blank", "green", "green", "green", "green", "green", "green", "blank", "blank", "blank", "blank", "blank"];
let mapRow2=["blank", "blank", "blank", "green", "green", "white", "white", "white", "green", "green", "green", "green", "green", "blank", "blank", "blank"];
let mapRow3=["blank", "blank", "green", "white", "white", "green", "green", "green", "green", "green", "green", "green", "green", "green", "blank", "blank"];
let mapRow4=["blank", "green", "white", "green", "blue", "blue", "green", "green", "green", "green", "blue", "blue", "green", "green", "green", "blank"];
let mapRow5=["blank", "green", "green", "blue", "white", "white", "blue", "green", "green", "blue", "white", "white", "blue", "green", "green", "blank"];
let mapRow6=["green", "green", "green", "blue", "white", "blue", "blue", "green", "green", "blue", "white", "blue", "blue", "green", "green","green"];
let mapRow7=["green", "green", "green", "blue", "blue", "blue", "blue", "green", "green", "blue", "blue", "blue", "blue", "green", "green","green"];
let mapRow8=["green", "green", "green", "blue", "blue", "blue", "blue", "green", "green", "blue", "blue", "blue", "blue", "green", "green","green"];
let mapRow9=["green", "green", "green", "green", "blue", "blue", "green", "green", "green", "green", "blue", "blue", "green", "green", "green","green"];
let mapRow10=["green", "green", "blue", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "blue", "green","green"];
let mapRow11=["green", "green", "green", "blue", "blue", "green", "green", "green", "green", "green", "green", "blue", "blue", "green", "green","green"];
let mapRow12=["blank", "green", "green", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "green", "green", "blank"];
let mapRow13=["blank", "green", "green", "green", "green", "blue", "pinkShadow", "pinkShadow", "pinkShadow", "pinkShadow", "blue", "green", "green", "green", "green", "blank"];
let mapRow14=["blank", "blank", "green", "green", "green", "green", "pink", "pinkShadow", "pinkShadow", "pink", "green", "green", "green","green", "blank", "blank"];
let mapRow15=["blank", "blank", "blank", "green", "green", "green", "pink", "pink", "pink", "pink", "green", "green", "green", "blank", "blank", "blank"];
let mapRow16=["blank", "blank", "blank", "blank", "blank", "green", "green", "pink", "pink", "green", "green", "blank", "blank", "blank", "blank", "blank"];

let mapTotal = [mapRow1, mapRow2, mapRow3, mapRow4, mapRow5, mapRow6, mapRow7, mapRow8, mapRow9, mapRow10, mapRow11, mapRow12, mapRow13, mapRow14, mapRow15, mapRow16];

class MapColor{
    static instances=[];
    constructor(colorVar, clss, label){
        this.colorVar = colorVar;
        this.clss = clss;
        this.label = label;
        this.array = [];
        MapColor.instances.push(this);
    }
    arrayCompile (){
        for (let i=0; i<mapTotal.length; i++){
            for (let n=0; n<mapTotal[i].length; n++){
                if (mapTotal[i][n]===this.label){
                    let coordinates = [i, n]
                    // let txtCoords = coordinates.toString();
                    // this.array.push(txtCoords);
                    this.array.push(coordinates);
                };
            };
        };
    };
};
const mapGreens = new MapColor("--color1", "mapGreen", "green");
const mapBlues = new MapColor("--color2", "mapBlue", "blue");
const mapPinks = new MapColor("--color5", "mapPink", "pink");
const mapPinkShadows = new MapColor("--color5", "mapPink mapShadow", "pinkShadow");
const mapWhites = new MapColor("--color4", "mapWhite", "white");

function compileMap(){
    for (let i=0; i<MapColor.instances.length; i++){
        MapColor.instances[i].arrayCompile();
        // console.log(MapColor.instances[i].array)
    };
};
compileMap();
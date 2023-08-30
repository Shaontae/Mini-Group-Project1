class Emoji{
    static instances = [];
    constructor(emo, image, keywords){
        this.emo = emo,
        this.image =image;
        this.keywords = keywords,
        Emoji.instances.push(this)
    }
}

const frown = new Emoji("sad", "placeholder", []);
const smile = new Emoji("happy", "placeholder", []);
const steam = new Emoji("angry", "placeholder", []);

let startBtn = document.getElementById("startBtn");

startBtn.addEventListener('click', ()=>{
    startBtn.style.display = "none";
    appendEmojis();
    }, { once:true });

function appendEmojis(){
    let emojiContainer = document.createElement("div");
    let emojiList = document.createElement("ul");


    emojiContainer.className = ("emoji-div");
    document.body.appendChild(emojiContainer);
    
    // creates UL to hold the emoji lists
    
    emojiContainer.appendChild(emojiList);

    // var count = 1; //empty counter to add class names
    //for loop to create list items and buttons 
    for (i = 0; i < Emoji.instances.length; i++) {
        let li = document.createElement('li'); // creates li(s)
        let button = document.createElement('button'); // creates anchors within the list items
        button.className = Emoji.instances[i].emo;
        emojiList.appendChild(li); //appending to UL
        li.appendChild(button); // appending to the newly created list items
    };
}
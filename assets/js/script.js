class Emoji{
    static instances = [];
    constructor(emo, emoj, keywords){
        this.emo = emo,
        this.emoj = emoj;
        this.keywords = keywords,
        Emoji.instances.push(this)
    }
}

const crying = new Emoji("sad", "placeholder", [sad, depressed, unwell, anxious, hysterical]);
const smile = new Emoji("happy", "placeholder", [happy, elated, good, fair]);
const red = new Emoji("angry", "placeholder", [angry, mad, fuming, angered, pissed, infuriated]);
const gasp = new Emoji("shocked", "placeholder", [shocked, spooked, nervous, scared]);
const upsideDownSmiley = new Emoji("uneasy", "placeholder", [uneasy, nervous, restless, tense]);
const loved = new Emoji("loving", "placeholder", [loving, affectionate, romantical, passionate]);
const moneyTongue = new Emoji("moneyHungry", "placeholder", [greedy, eager, desirous, materialistic, moneygrubbing]);
const hmm = new Emoji("thinking", "placeholder", [curious, interested, documentary, quizzical]);
const sick = new Emoji("sick", "placeholder", [sick, unwell, ill]);
const disgusted = new Emoji("disgust", "placeholder", [sick, unwell, ill, disgusted, unwell]);
const queasy = new Emoji("queasy", "placeholder", [Queasy, squeamish, woozy, nauseous]);
const cowboy = new Emoji("cowboy", "placeholder", [old-timey, western, cowboy, wildwest]);
const nerd = new Emoji("nerdy", "placeholder", [smart, nerdy, intelligent, intellectual]);
const tired = new Emoji("yawn", "placeholder", [tired, exhausted, sprung-out]);
const inLove = new Emoji("loved", "placeholder", [Lovestruck, loving, careful, flamboyant]);




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
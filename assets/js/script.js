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




let container = document.querySelector("#container");
let containerHeader = document.querySelector("#container-header");
let headerTitle = document.querySelector("#container-h2");
let baseCard = document.querySelector("#base-card");

function renderEmojis(){
    let emojisContainer = document.createElement("div");
    let emojiTitle = document.createElement("h3");
    let fullUl = document.createElement("ul");

    let n=0;
    let rowList = [];
    let emojiRowRem = Emoji.instances.length%5;
    let emojiRowN = ((Emoji.instances.length-emojiRowRem)/5)+1
    headerTitle.textContent = "How are you feeling?";
    emojiTitle.textContent = "Choose 3-7 emojis that best describe what mood you're in."
    
    emojiContainer.appendChild(emojiList);

    for (let i=0; i<emojiRowN; i++){
        let ul = document.createElement("ul");
        ul.setAttribute("class", "emoji-row");
        rowList.push(ul);
    };

    for (let i = 0; i < Emoji.instances.length; i++) {
        let li = document.createElement('li');
    };
}




// let rtUrl = null;
// let omdbUrl = "http://www.omdbapi.com/?apikey=1aa15ab1&t=gone+with+the+wind&plot=full";
// fetch(omdbUrl)
//     .then((response)=>{
//         if (response.status===200){
//             return response.json();
//         }
//     })
//     .then((data)=>{
//         console.log(data);
//     })
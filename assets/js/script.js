class Emoji{
    static instances = [];
    constructor(emo, emote, keywords){
        this.emo = emo,
        this.emote = emote;
        this.keywords = keywords,
        this.index = Emoji.instances.length;
        Emoji.instances.push(this)
    }
}

const crying = new Emoji("sad", "😭", ['sad', 'depressed', 'unwell', 'anxious', 'hysterical']);
const smile = new Emoji("happy", "😀", ['happy', 'elated', 'good', 'fair']);
const red = new Emoji("angry", "😡", ['angry', 'mad', 'fuming', 'angered', 'pissed', 'infuriated']);
const gasp = new Emoji("shocked", "😯", ['shocked', 'spooked', 'nervous', 'scared']);
const upsideDownSmiley = new Emoji("uneasy", "🙃", ['uneasy', 'nervous', 'restless', 'tense']);
const loved = new Emoji("loving", "🥰", ['loving', 'affectionate', 'romantical', 'passionate']);
const moneyTongue = new Emoji("moneyHungry", "🤑", ['greedy', 'eager', 'desirous', 'materialistic', 'moneygrubbing']);
const hmm = new Emoji("thinking", "🤔", ['curious', 'interested', 'documentary', 'quizzical']);
const sick = new Emoji("sick", "🤒", ['sick', 'unwell', 'ill']);
const disgusted = new Emoji("disgust", "🤢", ['sick', 'unwell', 'ill', 'disgusted', 'unwell']);
const queasy = new Emoji("queasy", "🥴", ['Queasy', 'squeamish', 'woozy', 'nauseous']);
const cowboy = new Emoji("cowboy", "🤠", ['old-timey', 'western', 'cowboy', 'wildwest']);
const nerd = new Emoji("nerdy", "🤓", ['smart', 'nerdy', 'intelligent', 'intellectual']);
const tired = new Emoji("yawn", "🥱", ['tired', 'exhausted', 'sprung-out']);
const inLove = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test1 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test2 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test3 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);





let container = document.querySelector("#container");
let containerHeader = document.querySelector("#container-header");
let headerTitle = document.querySelector("#container-h2");
let baseCard = document.querySelector("#base-card");

function renderEmojis(){
    let emojisContainer = document.createElement("div");
    let emojiTitle = document.createElement("h3");
    let fullUl = document.createElement("ul");

    let n=0;
    let emojiRows = [];
    let subUls = [];
    let emojiRowRem = Emoji.instances.length%5;
    let emojiRowN = ()=>{
        if (emojiRowRem>0){
            return ((Emoji.instances.length-emojiRowRem)/5)+1;
        } else {
            return ((Emoji.instances.length-emojiRowRem)/5);
        };
    }

    fullUl.setAttribute("class", "fullUl");
    emojisContainer.setAttribute("class", "emoji-container");

    
    headerTitle.textContent = "How are you feeling?";
    emojiTitle.textContent = "Choose 3-7 emojis that best describe what mood you're in."

    for (let i=0; i<emojiRowN(); i++){
        let li = document.createElement("li");
        let ul = document.createElement("ul");
        ul.setAttribute("class", "emoji-row");
        li.setAttribute("class", "emojiEl");
        emojiRows.push(li);
        subUls.push(ul);
    };

    
    for (let i = 0; i < Emoji.instances.length; i++) {
        let li = document.createElement('li');
        let p = document.createElement('p');
        li.setAttribute("class", "emojiBox");
        p.setAttribute("class", "emojiImg");
        p.textContent = Emoji.instances[i].emote;
        if (subUls[n].childElementCount===5){
            emojiRows[n].appendChild(subUls[n]);
            fullUl.appendChild(emojiRows[n]);
            n++;
        }
        li.appendChild(p);
        subUls[n].appendChild(li);
        let x=n+1;
        if (x===emojiRowN()&&i+1===Emoji.instances.length){
            console.log("index: "+Emoji.instances[i].index)
            emojiRows[n].appendChild(subUls[n]);
            fullUl.appendChild(emojiRows[n]);
        };
    };

    emojisContainer.appendChild(fullUl);
    baseCard.appendChild(emojiTitle);
    baseCard.appendChild(emojisContainer);
}

renderEmojis()

// fetch("https://emojihub.yurace.pro/api/all")
//     .then((response)=>{
//         if (response.status===200){
//             return response.json();
//         }
//     })
//     .then((data)=>{
//         console.log(data);
//     })

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
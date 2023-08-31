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
// const test4 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test5 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test6 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test7 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test8 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test9 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test10 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test11 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test12 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);


let chosenEmojis = [];


let container = document.querySelector("#container");
let containerHeader = document.querySelector("#container-header");
let headerTitle = document.querySelector("#container-h2");
let baseCard = document.querySelector("#base-card");

function renderEmojis(){
    let storedEmojis = JSON.parse(localStorage.getItem("emojisMaster"));
        if (storedEmojis!==null){
            chosenEmojis=storedEmojis;
        };
    // let isReady = false;
    let emojisContainer = document.createElement("div");
    let emojiTitle = document.createElement("h3");
    let fullUl = document.createElement("ul");

    let choiceBox = document.createElement("div");
    let button = document.createElement("div");
    let emojiRules = document.createElement("h3");
    let choiceList = document.createElement("ul");

    choiceList.setAttribute("class", "emoji-choice-list");
    choiceBox.setAttribute("class", "emoji-choice-box");
    fullUl.setAttribute("class", "fullUl");
    emojisContainer.setAttribute("class", "emoji-container");

    button.textContent = "Next";
    emojiRules.textContent = "Choose 3-7 Emojis"
    headerTitle.textContent = "How are you feeling?";
    emojiTitle.textContent = "Which emojis that best describe what mood you're in?"

    renderEmojiGrid();
    renderChoices()
    buttonCheck();

    emojisContainer.appendChild(fullUl);
    choiceBox.appendChild(choiceList);
    baseCard.appendChild(emojiTitle);
    baseCard.appendChild(emojisContainer);
    baseCard.appendChild(emojiRules);
    baseCard.appendChild(choiceBox);
    baseCard.appendChild(button);

    button.addEventListener("click", ()=>{
        let gridList = document.getElementsByClassName("emojiGrid");
        let choiceSlots = document.getElementsByClassName("choiceSlot");
        for (let i=0; i<gridList.length; i++){
            gridList[i].removeEventListener("click", addEmoji);
        }
        for (let i=0; i<choiceSlots.length; i++){
            choiceSlots[i].removeEventListener("click", removeEmoji);
        }
    },{ once:true })


    function renderEmojiGrid(){
        let n=0;
        let emojiRows = [];
        let subUls = [];
        let sqr = Math.floor(Math.sqrt(Emoji.instances.length))+1;
        let emojiRowRem = Emoji.instances.length%sqr;
        let emojiRowN = ()=>{
            if (emojiRowRem>0){
                return ((Emoji.instances.length-emojiRowRem)/sqr)+1;
            } else {
                return ((Emoji.instances.length-emojiRowRem)/sqr);
            };
        };

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
            
            p.setAttribute("data-index", Emoji.instances[i].index);
            gridCheck(p, false);
            
            p.textContent = Emoji.instances[i].emote;
            if (subUls[n].childElementCount===sqr){
                emojiRows[n].appendChild(subUls[n]);
                fullUl.appendChild(emojiRows[n]);
                n++;
            }
            li.appendChild(p);
            subUls[n].appendChild(li);
            let x=n+1;
            if (x===emojiRowN()&&i+1===Emoji.instances.length){
                emojiRows[n].appendChild(subUls[n]);
                fullUl.appendChild(emojiRows[n]);
            };
            // p.addEventListener("click", addEmoji, { once:true })
            emojiListener(p);
        };
    };

    function buttonCheck(){
        if (chosenEmojis.length<3){
            button.setAttribute("class", "emoji-submit off");
            // button.addEventListener("click", , { once:true });
        } else {
            button.setAttribute("class", "emoji-submit on");
            // button.removeEventListener("click", , { once:true });
        }
    };

    function renderChoices(){
        let storedEmojis = JSON.parse(localStorage.getItem("emojisMaster"));
        if (storedEmojis!==null){
            chosenEmojis=storedEmojis;
        };
        choiceList.innerHTML='';
        for (let i=0; i<chosenEmojis.length; i++){
            let li = document.createElement("li");
            let p = document.createElement("p");
            // let emojiMatch = ()=>{

            // };
            p.setAttribute("data-index", chosenEmojis[i].index);
            
            li.setAttribute("class", "emojiBox");
            p.setAttribute("class", "choiceSlot emojiImg on");
            p.textContent = chosenEmojis[i].emote;
            li.appendChild(p);
            choiceList.appendChild(li);
            p.addEventListener("click", removeEmoji, { once:true })
            
        };
    };

    function addEmoji(event){
        let emoji = null;
        

        element = event.target;
        
        for (let i=0; i<Emoji.instances.length; i++){
            if (~~element.dataset.index===Emoji.instances[i].index){
                emoji=Emoji.instances[i];
            };
        };
        let storedEmojis = JSON.parse(localStorage.getItem("emojisMaster"));
        if (storedEmojis!==null){
            chosenEmojis=storedEmojis;
        };
        chosenEmojis.push(emoji);
        localStorage.setItem("emojisMaster", JSON.stringify(chosenEmojis));
        // check all children of parent to delete event listeners
        addDropChange()
        renderChoices();
        buttonCheck();
    };

    function removeEmoji(event){
        let emoji = null;
        let storedEmojis = JSON.parse(localStorage.getItem("emojisMaster"));
        if (storedEmojis!==null){
            chosenEmojis=storedEmojis;
        };
        
        element = event.target;
        for (let i=0; i<Emoji.instances.length; i++){
            if (~~element.dataset.index===Emoji.instances[i].index){
                
                emoji=Emoji.instances[i];
            };
        };
        for (let i=0; i<chosenEmojis.length; i++){
            if (chosenEmojis[i].index===emoji.index){ 
                chosenEmojis.splice(i, 1);
            };
        };
        localStorage.setItem("emojisMaster", JSON.stringify(chosenEmojis));
        addDropChange()
        renderChoices();
        buttonCheck();
    }

    function addDropChange(){
        let gridList = document.getElementsByClassName("emojiGrid");
        for (let i=0; i<gridList.length; i++){
            gridCheck(gridList[i], true)
        }
    };

    function gridCheck(element, isBundled){
        let isIncludes = false;
        for (let ix=0; ix<chosenEmojis.length; ix++){
            if (~~element.dataset.index===chosenEmojis[ix].index){
                    isIncludes=true;
                }
        };
        if (isIncludes){
            element.setAttribute("data-active", "false");
            element.setAttribute("class", "emojiGrid emojiImg off");
        } else{
            element.setAttribute("data-active", "true");
            element.setAttribute("class", "emojiGrid emojiImg on");
        };

        if (isBundled){
            emojiListener(element)
        }
    }

    function emojiListener(element){
        if (element.dataset.active==="true"&&chosenEmojis.length<7){
            element.addEventListener("click", addEmoji, { once:true });
        } else {
            element.removeEventListener("click", addEmoji);
        }
    }
}

renderEmojis();

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
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
// const test13 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test14 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test15 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test16 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test17 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test18 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test19 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test20 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test21 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test22 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test23 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);
// const test24 = new Emoji("loved", "💘", ['lovestruck', 'loving', 'careful', 'flamboyant']);


let chosenEmojis = [];


let container = document.querySelector("#container");
let containerHeader = document.querySelector("#container-header");
let headerTitle = document.querySelector("#container-h2");
let baseCard = document.querySelector("#base-card");

renderEmojis();

function renderEmojis(){
    let storedEmojis = JSON.parse(localStorage.getItem("emojisMaster"));
    if (storedEmojis!==null){
        chosenEmojis=storedEmojis;
    };
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

    button.textContent = "NEXT";
    emojiRules.textContent = "Choose 3-7 Emojis"
    headerTitle.textContent = "How are you feeling?";
    emojiTitle.textContent = "Which emojis that best describe what mood you're in?"

    renderEmojiGrid();
    renderChoices();
    

    emojisContainer.appendChild(fullUl);
    choiceBox.appendChild(choiceList);
    baseCard.appendChild(emojiTitle);
    baseCard.appendChild(emojisContainer);
    baseCard.appendChild(emojiRules);
    baseCard.appendChild(choiceBox);
    baseCard.appendChild(button);
    
    buttonCheck();

    // button.addEventListener("click", buttonFn,{ once:true })

    function buttonFn(){
        let gridList = document.getElementsByClassName("emojiGrid");
        let choiceSlots = document.getElementsByClassName("choiceSlot");
        for (let i=0; i<gridList.length; i++){
            gridList[i].removeEventListener("click", addEmoji);
        };
        for (let i=0; i<choiceSlots.length; i++){
            choiceSlots[i].removeEventListener("click", removeEmoji);
        };
        renderInput();
    }


    function renderEmojiGrid(){
        let n=0;
        let emojiRows = [];
        let subUls = [];
        // Add conditions in case of perfect square, because the +1 in
        // perfect square would produce overflow
        // Ref(1)
        let sqr = ()=>{
            let intCheck = Math.sqrt(Emoji.instances.length)
            if (Number.isInteger(intCheck)){
                return intCheck;
            }
            else{
                return Math.floor(intCheck)+1;
            }; 
        };
        let emojiRowRem = Emoji.instances.length%sqr();
        // --(1)
        let emojiRowN = ()=>{
            if (emojiRowRem>0){
                return ((Emoji.instances.length-emojiRowRem)/sqr())+1;
            } else {
                return ((Emoji.instances.length-emojiRowRem)/sqr());
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
            if (subUls[n].childElementCount===sqr()){
                emojiRows[n].appendChild(subUls[n]);
                fullUl.appendChild(emojiRows[n]);
                n++;
            };
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
            button.removeEventListener("click", buttonFn);
        } else {
            button.setAttribute("class", "emoji-submit on");
            button.addEventListener("click", buttonFn, { once:true });
        };
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
            p.addEventListener("click", removeEmoji, { once:true });
            
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
        addDropChange();
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
            gridCheck(gridList[i], true);
        };
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
        };
    };

    function emojiListener(element){
        if (element.dataset.active==="true"&&chosenEmojis.length<7){
            element.addEventListener("click", addEmoji, { once:true });
        } else {
            element.removeEventListener("click", addEmoji);
        };
    };
}

function renderInput(){
    baseCard.innerHTML="";
    // let charN = 0;
    let inputBox = document.createElement("div");
    let userForm = document.createElement("form");
    let question = document.createElement("label");
    let userInput = document.createElement("textarea");
    let charMax = document.createElement("p");
    let inputButton = document.createElement("div");
    
    userInput.setAttribute("maxLength", "500")

    // let inputBox = document.createElement("div");
    // let userForm = document.createElement("form");
    // let question = document.createElement("label");
    // let userInput = document.createElement("textarea");
    // let charMax = document.createElement("p");
    // let inputButton = document.createElement("div");

    question.textContent = "What kind of movies are you into?"
    charMax.textContent = userInput.value.trim().length+"/"+userInput.maxLength+" Characters"

    userForm.appendChild(question);
    userForm.appendChild(userInput);
    userForm.appendChild(charMax);
    userForm.appendChild(inputButton);
    inputBox.appendChild(userForm);
    baseCard.appendChild(inputBox);

    userInput.addEventListener("keydown", charCounter);

    function charCounter(){
        if (~~~userInput.maxLength<=userInput.value.trim().length){
            charMax.textContent= userInput.value.trim().length+"/"+userInput.maxLength+" Characters";
            
        } else {
            let key = event.keyCode || event.charCode;
        
            if ( key !== 8 && key !== 46 ){
                console.log("coming soon.")
            };
        }
    }
    
};

// fetch("https://emojihub.yurace.pro/api/all")
//     .then((response)=>{
//         if (response.status===200){
//             return response.json();
//         }
//     })
//     .then((data)=>{
//         console.log(data);
//     })
// let bub = [];
// let testVar=0;
let omdbTest=[];
let rtUrl = null;
let omdbUrl = "http://www.omdbapi.com/?apikey=1aa15ab1&type=movie&plot=full&s=$comedy";
// omdbUrl = "http://www.omdbapi.com/?apikey=1aa15ab1&type=movie&plot=full&s=$comedy";
// fetch(omdbUrl)
//     .then((response)=>{
//         if (response.status===200){
//             return response.json();
//         }
//     })
//     .then((data)=>{
//         console.log(data)
//         let w =0;
//         for (let i=0; i<data.Search.length; i++){
//             let titleFix = data.Search[i].Title.replace(/\s/g, '+');
//             fetch("http://www.omdbapi.com/?apikey=1aa15ab1&type=movie&plot=full&t="+titleFix)
//             .then((response)=>{
//                 if (response.status===200){
//                     return response.json();
//                 } else{
//                     console.log("Ya fucked it.")
//                 }
//             })
//             .then((data)=>{
//                 if (data.Plot.includes("not")){
//                     omdbTest.push(data);
                    
//                 }
                
//             })
//             // console.log(w)
//         }
        
//     }).then(()=>{console.log(omdbTest);})

// function allResultsOMDB(object){
//     let remainder = object.totalResults%10;
//     let pages = ()=>{
//         if (remainder===0){
//             return object.totalResults/10;
//         } else {
//             return ((object.totalResults-remainder)/10)+1
//         };
//     };

//     let promiseList1 =[]
//     let promiseList2 =[]
//     for (let i=0; i<pages(); i++){
        
//         let x = i+1;
//         omdbUrl = "http://www.omdbapi.com/?apikey=1aa15ab1&type=movie&plot=full&tomatoes=true&page="+x+"&s=$comedy";
//         let testPromise = fetch(omdbUrl)
//             .then((response)=>{
//                 if (response.status===200){
//                     return response.json();
//                 }
//             })
//             .then((data)=>{
//                 // omdbTest.push(data.response);
//                 promiseList1.push(testPromise);
//             })
//     }
//     return new Promise((resolve) => {
//         Promise.all(promiseList1)
//           .then((proms) =>
//             proms.forEach((p) => promiseList2.push({
//               results: p.results
//             }))
//           )
//           .then(() => resolve(promiseList2));
//       });
// };

// fetch("https://emojihub.yurace.pro/api/random/category/smileys-and-people")
//     .then((response)=>{
//         if (response.status===200){
//             return response.json();
//         }
//     })
//     .then((data)=>{
//         console.log(data);
//     })

// moviedb key=654175309f8dda54d6e0ea0c7706fa04

// let mdbUrl = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_keywords=horror&api_key=654175309f8dda54d6e0ea0c7706fa04';
let mdbUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=654175309f8dda54d6e0ea0c7706fa04&include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&page=1';
// let mdbUrl = "https://api.themoviedb.org/3/search/keyword?api_key=654175309f8dda54d6e0ea0c7706fa04&query=alligator"
// mdbUrl='https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=654175309f8dda54d6e0ea0c7706fa04'
// mdbUrl='https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=654175309f8dda54d6e0ea0c7706fa04'
mdbUrl = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=10770%2C53&api_key=654175309f8dda54d6e0ea0c7706fa04'
// mdbUrl = "https://api.themoviedb.org/3/discover/movie?query=alligator&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=654175309f8dda54d6e0ea0c7706fa04"
// let testArray = [];
// fetch(mdbUrl)
//     .then((response)=>{
//         if (response.status===200){
//             return response.json();
//         }
//     })
//     .then((data)=>{
//         testArray.push(data)
//         mdbParseResults(data.total_pages, testArray, "prison", "https://api.themoviedb.org/3/discover/movie?api_key=654175309f8dda54d6e0ea0c7706fa04&include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&with_genres=10770%2C53&page=")
//     })
// function mdbParseResults(pages, array, keyword, url){
//     let x=0;
//     for (let i=0; i<pages; i++){
//         x = i+1;
//         genUrl = url+x;
//         fetch(genUrl)
//             .then((response)=>{
//                 if (response.status===200){
//                     return response.json();
//                 };
//             })
//             .then((data)=>{
//                 array.push("bub")
//             })
//     }
// };

// function mdbParseResults(pages, array, keyword, url){
//     let x=0;
//     for (let i=0; i<pages; i++){
//         x = i+1;
//         genUrl = url+x;
//         fetch(genUrl)
//             .then((response)=>{
//                 if (response.status===200){
//                     return response.json();
//                 };
//             })
//             .then((data)=>{
//                 array.push("bub")
                
//                 // This is also specific to themoviedb because object keys can't be passed as arguments
//                 for (let n=0; n<data.results.length; n++){
//                     // genArray(data.results[i]);
//                     // if (data.results[n].overview!==undefined&&data.results[n].hasOwnProperty("overview")){
//                     // }
                    
//                     if (data.results[n].overview.includes(keyword)){
//                         // testArray.push(data.results[n]);
//                         // testArray.push("bub");
//                     }
//                 };
//             })
//     }
//     // function genArray(object){
//     //     // Gotta get specific for each api call
//         // if (object.overview.includes(keyword)){
//         //     array.push(object);
//         // }
//     // }
// };



// function tabulateResults(data, totalResults, limit, array, keyword, url){
//     let remainder = data.%limit;
//     let pages = ()=>{
//         if (remainder===0){
//             return data.totalResults/limit;
//         } else {
//             return ((data.totalResults-remainder)/limit)+1
//         };
//     };

//     for (let i=0; i<pages(); i++){
//         let x = i+1;
//         genUrl = url+x;
//         fetch(genUrl)
//             .then((response)=>{
//                 if (response.status===200){
//                     return response.json();
//                 }
//             })
//             .then((data)=>{
                
//                 // This is also specific to themoviedb because object keys can't be passed as arguments
//                 for (let i=0; i<limit; i++)
//                     genArray(data.results[i]);
//             })
//     }
//     function genArray(object){
//         // Gotta get specific for each api call
//         if (object.overview.includes(keyword)){
//             array.push(object);
//         }
//     }
// };

fetch("https://api.dictionaryapi.dev/api/v2/entries/en/tug")
    .then((response)=>{return response.json()})
    .then((data)=>{console.log(data)})
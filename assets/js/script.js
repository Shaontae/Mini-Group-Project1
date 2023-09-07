let rootEl = document.querySelector(":root");
let bodyEl = document.querySelector("#body");
let stopEl = document.querySelector("#stop");
let pauseEl = document.querySelector("#pause");
let playEl = document.querySelector("#play");

class ColorVar {
    static instances = [];
    constructor(label, oCode) {
        this.label = label;
        this.oCode = oCode;
        ColorVar.instances.push(this);
        this.paused = false; // Add a 'paused' property to track the pause state
    }
    changeFn() {
        if (this.paused) return; // Check if the color change is paused
        let rVal = () => {
            return Math.floor(Math.random() * 255);
        };
        let r = rVal();
        let g = rVal();
        let b = rVal();
        let clrCode = "rgb(" + r + "," + g + "," + b + ")";
        document.body.style.setProperty(this.label, clrCode);
    }
    cResetFn() {
        document.body.style.setProperty(this.label, this.oCode);
    }
    togglePause() {
        this.paused = !this.paused; // Toggle the 'paused' state
    }
}

const color1 = new ColorVar("--color1", "#b4e8b4");
const color2 = new ColorVar("--color2", "#1f1f7c");
const color3 = new ColorVar("--color5", "#fc8eac");

const colorSwitch = document.getElementById('colorSwitch');
const pauseButton = document.getElementById('pauseButton'); // Add a pause button
const pauseLabel = document.getElementById('pauseLabel');

colorSwitch.addEventListener('change', () => {
    if (colorSwitch.checked) {
        // Show the pause button and label using Tailwind CSS classes
        pauseLabel.classList.remove('hidden');
        pauseButton.classList.remove('hidden');
        document.body.addEventListener('click', () => {
            ColorVar.instances.forEach(colorVar => colorVar.changeFn());
        });
    } else {
        ColorVar.instances.forEach(colorVar => colorVar.cResetFn());
        document.body.removeEventListener('click', () => {
            ColorVar.instances.forEach(colorVar => colorVar.changeFn());
        });
        // Hide the pause button and label using Tailwind CSS classes
        pauseLabel.classList.add('hidden');
        pauseButton.classList.add('hidden');
    }
});

pauseButton.addEventListener('click', () => {
    // Toggle the pause state for all ColorVar instances
    ColorVar.instances.forEach(colorVar => colorVar.togglePause());
});

let chosenEmojis = [];
let eligibleEmojis = [];
let keywordsRaw = [];
let keywordSluice = [];
let errorLogs = [];
let bugWords = ["CHRISTMAS", "SANTA", "ASIAN", "CHINESE", "JAPANESE"];
// let emojiNum = 0;
let stage = 0;
let stageArray = [renderStart, renderEmojis, renderInput];



let container = document.querySelector("#container");
let containerHeader = document.querySelector("#container-header");
let headerTitle = document.querySelector("#container-h2");
let baseCard = document.querySelector("#base-card");
let resetButton = document.querySelector("#reset-button");

// // bodyEl.addEventListener("click", colorChange);
// stopEl.addEventListener("click",()=>{
//     for (let i=0; i<ColorVar.instances.length; i++){
//         ColorVar.instances[i].cResetFn();
//         bodyEl.removeEventListener("click", colorChange);
//     };
// })
// pauseEl.addEventListener("click",()=>{
//     for (let i=0; i<ColorVar.instances.length; i++){
//         bodyEl.removeEventListener("click", colorChange);
//     };
// });
// playEl.addEventListener("click",()=>{
//     for (let i=0; i<ColorVar.instances.length; i++){
//         bodyEl.addEventListener("click", colorChange);
//     };
// });

resetButton.addEventListener("click", resetButtonFn);


// renderEmojis();

stageFunction();

// Misc. FUnctions
function colorChange(){
    for (let i=0; i<ColorVar.instances.length; i++){
        ColorVar.instances[i].changeFn();
    };
};

function stageFunction(){
    let storedStage = JSON.parse(localStorage.getItem("stageMaster"));
    if (storedStage !== null){
        stage = ~~storedStage;
    };
    stageArray[stage]();
};

function resetButtonFn(){
    
    // JSON List:
    // stage (number) - stageMaster
    // emojiNum (number) - eNumMaster
    // chosenEmojis (array) - emojisMaster
    // eligibleEmojis (array) - eligibleMaster
    // more to come

    baseCard.innerHTML = '';

    stage = 0;
    // emojiNum = 0;
    chosenEmojis = [];
    eligibleEmojis = [];
    
    
    localStorage.setItem("stageMaster", JSON.stringify(stage));
    // localStorage.setItem("eNumMaster", JSON.stringify(emojiNum));
    localStorage.setItem("emojisMaster", JSON.stringify(chosenEmojis));
    localStorage.setItem("eligibleMaster", JSON.stringify(eligibleEmojis));


    // call startupFunction
    
    stageFunction();
};

function buttonCheck(element, condition, fn){
    if (!condition){
        element.setAttribute("class", "emoji-submit off");
        element.removeEventListener("click", fn);
    } else {
        element.setAttribute("class", "emoji-submit on");
        element.addEventListener("click", fn, { once:true });
    };
};


function stageUpFn(){
    baseCard.innerHTML='';
    stage++
    localStorage.setItem("stageMaster", JSON.stringify(stage));
    stageFunction();
};

function wordParser(str){
    let keywordsFloat = [];
    // let promisesFloat = [];
    let storedKeywords = JSON.parse(localStorage.getItem("keywordsMaster"));
    if (storedKeywords !== null){
        keywordsRaw = storedKeywords;
    };

    let puncFn = (word)=>{
        let newWord = "";
        for (let n=0; n<word.length; n++){
            if (word[n]!=="."&&word[n]!==","){
                newWord+=word[n];
            };
        };
        return newWord;
    };
    let splitArray = str.split(" ");
    
    for (let i=0; i<splitArray.length; i++){
        splitArray[i] = puncFn(splitArray[i]);
        if (bugWords.includes(splitArray[i].toUpperCase())){
            keywordsRaw.push(splitArray[i].toUpperCase());
        } else {
            if (!keywordsRaw.includes(splitArray[i].toUpperCase())&&!stopwordsData.includes(splitArray[i].toLowerCase())&&!splitArray[i].includes("type-")&&!splitArray.includes("≊")){
                keywordsFloat.push(splitArray[i])
                // promisesFloat.push(fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+splitArray[i]))
            };
        };
    };
    let promisesFloat = keywordsFloat.map(r => fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+r).then((result)=>{
        let tempArray=[];
        if (result.status===200){
            tempArray.push(result.json())
        } else {
            let storedErrors = JSON.parse(localStorage.getItem("errorsMaster"));
            if (storedErrors!==null){
                errorLogs = storedErrors;
            }
            errorLogs.push([r,result.status]);
            tempArray.push(["error"]);
            localStorage.setItem("errorsMaster", JSON.stringify(errorLogs));
        }
        return tempArray
    }))
    
    // let promisesFloat = keywordsFloat.map(r => fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+r)
    // .then((response)=>{console.log(response)})
    // )
    // console.log(keywordsFloat)
    // console.log(promisesFloat)

    Promise.allSettled(promisesFloat).then((response)=>{
        // console.log(response)
        let dataResult = [];
        // console.log(promisesFloat)
        // const asyncTest = await (async ()=>{
        //     for (let i=0; i<response.length; i++){
        //         if (response[i].value[0][0]==="error"){
        //             response.splice(i, 1);
        //         } else{
        //             console.log("break")
        //             floatArray.push(keywordsFloat[i])
        //             // console.log(keywordsFloat)
        //         }
        //     }
        // })();
        for (let i=0; i<response.length; i++){
            if (response[i].value[0][0]==="error"){
                response.splice(i, 1);
            } else{
                
                // console.log(shortcut)
                // console.log("break")
                dataResult.push(response[i].value[0])
                keywordSluice.push(keywordsFloat[i])
                // console.log(keywordsFloat)
            }
        }
        Promise.allSettled(dataResult).then((results)=>{
            for (let i=0; i<results.length; i++){
                let iLimit = 0;
                for (let n=0; n<results[i].value[0].meanings.length; n++){
                    let shortcut = results[i].value[0].meanings[n]
                    for (let x=0; x< shortcut.synonyms.length; x++){
                        if (iLimit<5){
                            keywordSluice.push(shortcut.synonyms[x]);
                        };
                    };
                };
            };
        }).then(()=>(console.log(keywordSluice)))
        // console.log(response)
        // console.log(floatArray)
        // let tempArray=[];
        // for (let i=0; i<response.length; i++){
        //     console.log(response[i].status)
        //     if (response[i].status==="fulfilled"){
        //         // console.log(keywordsRaw.includes(keywordsFloat[i]))
        //         if (!keywordsRaw.includes(keywordsFloat[i])){
        //             console.log("bub")
        //             keywordsRaw.push(keywordsFloat[i])
        //         };
        //         tempArray.push(response[i].json());
        //     };
        // };
        // return tempArray;
    })
    console.log(keywordSluice)
//     .then((data)=>{
//         for (let i=0; i<data.length; i++){
//             let iLimit = 0;
//             for (let n=0; n<data[i][0].meanings.length; n++){
//                 for (let x=0; x<data[i][0].meanings[n].synonyms.length; x++){
//                     if (iLimit<5&&!keywordsRaw.includes(data[i][0].meanings[n].synonyms[x])){
//                         keywordsRaw.push(data[i][0].meanings[n].synonyms[x]);
//                     };
//                 };
//             };
//         };
//     }).then(()=>{
//         console.log(keywordsRaw.length)
//     })
};

// function wordParser(str){
//     let storedKeywords = JSON.parse(localStorage.getItem("keywordsMaster"));
//     if (storedKeywords !== null){
//         keywordsRaw = storedKeywords;
//     };
//     // let tempArray = str.split(/\s/gi);
//     let tempArray = str.split(" ");
//     for (let i=0; i<tempArray.length; i++){
//         // let word = tempArray[i]
//         // console.log(word)
//         let punFn = (word)=>{
//             let newWord = "";
//             for (let n=0; n<word.length; n++){
//                 if (word[n]!=="."&&word[n]!==","){
//                     newWord+=word[n];
//                 };
//             };
//             return newWord;
//         };
//         tempArray[i] = punFn(tempArray[i]);
//         if (bugWords.includes(tempArray[i].toUpperCase())){
//             keywordsRaw.push(tempArray[i].toUpperCase());
//         } else{
//             if (!keywordsRaw.includes(tempArray[i].toUpperCase())&&!stopwordsData.includes(tempArray[i].toLowerCase())&&!tempArray[i].includes("type-")&&!tempArray.includes("≊")){
//                 fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+tempArray[i])
//                 .then((response)=>{
//                     if (response.status ===200){
//                         return response.json()
//                     };
                    
//                 })
//                 .then((data)=>{
//                     // console.log(data)
//                     if (data!==undefined){
//                         let iLimit = 0;
//                         keywordsRaw.push(tempArray[i].toUpperCase());
//                         for (let n=0; n<data[0].meanings.length; n++){
//                             for (let x=0; x<data[0].meanings[n].synonyms.length; x++){
//                                 let shortenedEx = data[0].meanings[n].synonyms[x];
//                                 if (iLimit<5&&!keywordsRaw.includes(shortenedEx)){
//                                     keywordsRaw.push(shortenedEx.toUpperCase());
//                                     iLimit++;
//                                 };
//                             };
//                         };
//                     };
//                 })
//             };
//         }
        
//     };
//     // Promise.all(keywordsRaw).then(()=>{
//     //     console.log(keywordsRaw);
//     // });

// };


// Render Functions

function renderStart(){
    let emojiNum = 0;

    let randoTitle = document.createElement("h3");
    let randoInput = document.createElement("input");
    let button = document.createElement("div");
    let contentCard = document.createElement("div");
    let emptyBox = document.createElement("div");

    let limitVal = ()=>{
        // if (~~randoInput.value>=25&&~~randoInput.value<=1089&&~~randoInput.value!==''){
        if (~~randoInput.value>=25&&~~randoInput.value<=1089){
            return true
        } else {
            return false
        };
    };

    randoInput.setAttribute("class", "randoInput");
    randoInput.setAttribute("placeholder", "25-1089");
    randoInput.setAttribute("value", "");

    contentCard.setAttribute("class", "contentCard");
    emptyBox.setAttribute("class", "emptyBox");

    headerTitle.textContent = "Start";
    randoTitle.textContent = "Choose the number of Emoji choices you want."
    button.textContent = "NEXT";

    buttonCheck(button, limitVal());

    contentCard.append(randoTitle);
    contentCard.append(randoInput);
    contentCard.append(button);
    baseCard.append(contentCard);
    baseCard.append(emptyBox);

    randoInput.addEventListener("keydown", numeric)

    function numeric (event){
        
        element = event.target;
        let key = event.keyCode || event.charCode;
        
        if (isNaN(event.key)&&key !== 8&&key !== 46){
            event.preventDefault();
        } else {
            element.addEventListener("keyup", ()=>{
                buttonCheck(button, limitVal(), startStageUp);
            }, { once:true });
        };
        buttonCheck(button, limitVal(), startStageUp);
    };

    function startStageUp(){
        randoInput.removeEventListener("keydown", numeric);
        emojiNum = randoInput.value;
        // localStorage.setItem("eNumMaster", JSON.stringify(emojiNum));
        emojiRandomizer(emojiNum);
        stageUpFn();
    };

}

function emojiRandomizer(eNum){
    // let storedENum = JSON.parse(localStorage.getItem("eNumMaster"));
    // if (storedENum!==null){
    //     emojiNum = ~~storedENum;
    // };
    for (let i=0; i<eNum; i++){
        let randoFn=()=>{
            return Math.floor(Math.random()*emojiData.length);
        };
        let rando = randoFn();
        while (eligibleEmojis.includes(emojiData[rando])){
            rando=randoFn();
        };
        eligibleEmojis.push(emojiData[rando]);
    };
    for (let i=0; i<eligibleEmojis.length; i++){
        eligibleEmojis[i]["index"]=i;
    };
    localStorage.setItem("eligibleMaster", JSON.stringify(eligibleEmojis));
};


function renderEmojis(){
    let storedEligible = JSON.parse(localStorage.getItem("eligibleMaster"));
    let storedEmojis = JSON.parse(localStorage.getItem("emojisMaster"));
    if (storedEligible!==null){
        eligibleEmojis=storedEligible;
    };
    if (storedEmojis!==null){
        chosenEmojis=storedEmojis;
    };


    let emojiFloor=5;
    let emojiCeiling=emojiFloor;
    let activeCheck = ()=>{
        if (chosenEmojis.length<emojiFloor){
            return false;
        } else {
            return true;
        }
    };

    let codeGrab = (checkObj)=>{
        if (typeof checkObj.htmlCode==="string"){
            return checkObj.htmlCode;
        } else {
            return checkObj.htmlCode[0];
        }
    }

    let eChoiceCard = document.createElement("div")
    let emojiTitle = document.createElement("h3");
    let choiceBox = document.createElement("div");
    let button = document.createElement("div");
    let choiceList = document.createElement("ul");

    let gridCard = document.createElement("div");
    let emojiRules = document.createElement("h3");
    let emojisContainer = document.createElement("div");
    let fullUl = document.createElement("ul");

    
    eChoiceCard.setAttribute("class", "eChoiceCard")
    choiceList.setAttribute("class", "emoji-choice-list");
    choiceBox.setAttribute("class", "emoji-choice-box");

    gridCard.setAttribute("class", "gridCard")
    emojisContainer.setAttribute("class", "emoji-container");
    fullUl.setAttribute("class", "fullUl");
    
    headerTitle.textContent = "Make Your Choice";
    emojiTitle.textContent = "Which emojis call out to you?"
    button.textContent = "NEXT";

    emojiRules.textContent = "Choose 5 Emojis"
    

    renderEmojiGrid();
    renderChoices();
    

    emojisContainer.appendChild(fullUl);
    gridCard.appendChild(emojiRules);
    gridCard.appendChild(emojisContainer)
    choiceBox.appendChild(choiceList);
    eChoiceCard.appendChild(emojiTitle);
    eChoiceCard.appendChild(choiceBox);
    eChoiceCard.appendChild(button);

    baseCard.appendChild(eChoiceCard);
    baseCard.appendChild(gridCard);
    
    buttonCheck(button, activeCheck(), emojiButtonFn);

    function emojiButtonFn(){
        
        let gridList = document.getElementsByClassName("emojiGrid");
        let choiceSlots = document.getElementsByClassName("choiceSlot");
        for (let i=0; i<gridList.length; i++){
            gridList[i].removeEventListener("click", addEmoji);
        };
        for (let i=0; i<choiceSlots.length; i++){
            choiceSlots[i].removeEventListener("click", removeEmoji);
        };
        
        for (let i=0; i<chosenEmojis.length; i++){
            wordParser(chosenEmojis[i].name);
            wordParser(chosenEmojis[i].group);
        };
        stageUpFn();
    };

    function renderEmojiGrid(){
        let n=0;
        let emojiRows = [];
        let subUls = [];
        // Add conditions in case of perfect square, because the +1 in
        // perfect square would produce overflow
        // Ref(1)
        let sqr = ()=>{
            let intCheck = Math.sqrt(eligibleEmojis.length)
            if (Number.isInteger(intCheck)){
                return intCheck;
            }
            else{
                return Math.floor(intCheck)+1;
            }; 
        };


        
        let emojiRowRem = eligibleEmojis.length%sqr();
        // --(1)
        let emojiRowN = ()=>{
            if (emojiRowRem>0){
                return ((eligibleEmojis.length-emojiRowRem)/sqr())+1;
            } else {
                return ((eligibleEmojis.length-emojiRowRem)/sqr());
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

        
        for (let i = 0; i < eligibleEmojis.length; i++) {
            let li = document.createElement('li');
            let p = document.createElement('p');
            li.setAttribute("class", "emojiBox");
            
            p.setAttribute("data-index", eligibleEmojis[i].index);
            gridCheck(p, false);
            
            p.innerHTML = codeGrab(eligibleEmojis[i]);
            if (subUls[n].childElementCount===sqr()){
                emojiRows[n].appendChild(subUls[n]);
                fullUl.appendChild(emojiRows[n]);
                n++;
            };
            li.appendChild(p);
            subUls[n].appendChild(li);
            let x=n+1;
            if (x===emojiRowN()&&i+1===eligibleEmojis.length){
                emojiRows[n].appendChild(subUls[n]);
                fullUl.appendChild(emojiRows[n]);
            };
            // p.addEventListener("click", addEmoji, { once:true })
            emojiListener(p);
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
            p.innerHTML = codeGrab(chosenEmojis[i]);
            li.appendChild(p);
            choiceList.appendChild(li);
            p.addEventListener("click", removeEmoji, { once:true });
            
        };
    };

    function addEmoji(event){
        let emoji = null;
        element = event.target;
        
        for (let i=0; i<eligibleEmojis.length; i++){
            if (~~element.dataset.index===eligibleEmojis[i].index){
                emoji=eligibleEmojis[i];
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
        buttonCheck(button, activeCheck(), emojiButtonFn);
    };

    function removeEmoji(event){
        let emoji = null;
        let storedEmojis = JSON.parse(localStorage.getItem("emojisMaster"));
        if (storedEmojis!==null){
            chosenEmojis=storedEmojis;
        };
        
        element = event.target;
        for (let i=0; i<eligibleEmojis.length; i++){
            if (~~element.dataset.index===eligibleEmojis[i].index){
                
                emoji=eligibleEmojis[i];
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
        buttonCheck(button, activeCheck(), emojiButtonFn);
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
        if (element.dataset.active==="true"&&chosenEmojis.length<emojiCeiling){
            element.addEventListener("click", addEmoji, { once:true });
        } else {
            element.removeEventListener("click", addEmoji);
        };
    };

};

function renderInput(){
    // let charN = 0;
    let inputBox = document.createElement("div");
    let userForm = document.createElement("form");
    // let question = document.createElement("label");
    let question = document.createElement("h3");
    let userInput = document.createElement("textarea");
    let charMax = document.createElement("p");
    let button = document.createElement("div");
    
    

    inputBox.setAttribute("class", "inputBox");
    charMax.setAttribute("class", "charMax");
    userForm.setAttribute("class", "userForm");
    // question.setAttribute("class", "question");
    userInput.setAttribute("class", "userInput");
    button.setAttribute("class", "emoji-submit");

    userInput.setAttribute("maxLength", "500");
    button.setAttribute("style", "align-self: end")

    headerTitle.textContent="Time to Type"
    question.textContent = "What kind of movies are you into?"
    charMax.textContent = userInput.value.trim().length+"/"+userInput.maxLength+" Characters"
    button.textContent = "NEXT"

    userForm.appendChild(question);
    userForm.appendChild(userInput);
    userForm.appendChild(charMax);
    userForm.appendChild(button);
    inputBox.appendChild(userForm);
    baseCard.appendChild(inputBox);

    userInput.addEventListener("keydown", charCounter);

    function charCounter(event){
        if (~~~userInput.maxLength<=userInput.value.trim().length){
            charMax.textContent= userInput.value.trim().length+"/"+userInput.maxLength+" Characters";
            
        } else {
            let key = event.keyCode || event.charCode;
        
            if (key !== 8&&key !== 46){
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
// let mdbUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=654175309f8dda54d6e0ea0c7706fa04&include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&page=1';
// let mdbUrl = "https://api.themoviedb.org/3/search/keyword?api_key=654175309f8dda54d6e0ea0c7706fa04&query=alligator"
// mdbUrl='https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=654175309f8dda54d6e0ea0c7706fa04'
// mdbUrl='https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=654175309f8dda54d6e0ea0c7706fa04'
// mdbUrl = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=10770%2C53&api_key=654175309f8dda54d6e0ea0c7706fa04'
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




// fetch("https://api.dictionaryapi.dev/api/v2/entries/en/punch")
//     .then((response)=>{
//         if (response.status ===200){
//             return response.json()
//         };
        
//         })
//     .then((data)=>{console.log(data)})

let testWords = ["apple", "orange", "sparrow", "fork"];
let testPush =[]

function testFetch(word){
    fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+word)
        .then((response)=>{
            if (response.status===200){
                return response.json();
            }
        })
        .then((data)=>{
            console.log(data)
            return data;
            // testPush.push(data)
        });
}
async function testFn(){
    // const result = await testFetch(testWords[0]);
    // console.log(testPush)
    for (let i=0; i<testWords.length; i++){
        const result = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+testWords[i])
            .then((response)=>{
                if (response.status===200){
                    return response.json();
                };
            })
            .then((data)=>{
                // console.log(data)
                // return data;
                testPush.push(data)
            });
    }
    
    // console.log(testPush.length)
};
testFn();

// function movieFetch(movie){
//     let movieTitle = ()=>{
//         if (movie.includes(" ")){
//             return movie.replace((/\s/g, '%2B'));
//         } else{
//             return movie;
//         }
//     };
//     fetch('https://api.themoviedb.org/3/search/movie?api_key=654175309f8dda54d6e0ea0c7706fa04&include_adult=false&language=en-US&page=1&query='+movieTitle())
//     .then((response)=>{
//         if (response.status===200){
//             return response.json();
//         }
//     })
//     .then((data)=>{
//         console.log(data)
//     });
// };
// movieFetch("##Your Movie");


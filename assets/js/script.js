let rootEl = document.querySelector(":root");
let bodyEl = document.querySelector("#body");
// let stopEl = document.querySelector("#stop");
// let pauseEl = document.querySelector("#pause");
// let playEl = document.querySelector("#play");
let colorSwitchEl = document.querySelector("#colorSwitch");
let playPauseEl = document.querySelector("#play-pause");

class ColorVar {
    static instances = [];
    constructor(label, oCode) {
        this.label = label;
        this.oCode = oCode;
        ColorVar.instances.push(this);
        // this.paused = false; // Add a 'paused' property to track the pause state
    }
    changeFn() {
        // if (this.paused) return; // Check if the color change is paused
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
    // togglePause() {
    //     this.paused = !this.paused; // Toggle the 'paused' state
    // }
}

const color1 = new ColorVar("--color1", "#b4e8b4");
const color2 = new ColorVar("--color2", "#1f1f7c");
const color3 = new ColorVar("--color5", "#fc8eac");

colorSwitchEl.addEventListener("change", (box)=>{
    
    if (colorSwitchEl.checked){
        colorChange()
        
        playPauseEl.setAttribute("class", "material-icons play-pause");
        playPauseEl.textContent = "pause"

        playPauseEl.addEventListener("click", playPauseFn);
        bodyEl.addEventListener("click", colorChange);
    } else {
        for (let i=0; i<ColorVar.instances.length; i++){
            ColorVar.instances[i].cResetFn();
        };
        playPauseEl.setAttribute("class", "material-icons play-pause nv");
        playPauseEl.removeEventListener("click", playPauseFn);
        bodyEl.removeEventListener("click", colorChange);
    }
})

function playPauseFn(event){
    let element = event.target
    
    if (element.dataset.state ==="play"){
        
        element.dataset.state = "pause"
        bodyEl.removeEventListener("click", colorChange);
        playPauseEl.textContent = "play_arrow";
    } else {
        element.dataset.state = "play"
        bodyEl.addEventListener("click", colorChange);
        playPauseEl.textContent = "pause";
    }
        
}

// Local Storage Variables
let stage = 0;
let chosenEmojis = [];
let eligibleEmojis = [];
let keywordsRaw = [];
let currentQuestion = null;
let userInputRaw = "";
let movieMatches = [];
// /Local Storage Variables

let keywordSluice = [];

let errorLogs = [];
let keywordsTrash = [];


let bugWordsRaw = [
    ["Christmas", ["winter", "holiday", "gifts", "nativity", "snow", "Santa", "Claus"]],
    ["Santa", ["Christmas", "Claus", "sleigh", "gifts", "jolly", "beard", "reindeer"]],
    ["Claus", ["Christmas", "Claus", "sleigh", "gifts", "jolly", "beard", "reindeer"]],
    ["Asian", ["Asia", "asiatic", "China", "Japan", "Korea", "Vietnam"]],
    ["Chinese", ["Asia", "Asian", "China"]],
    ["China", ["Asia", "Asian", "Chinese"]],
    ["Japanese", ["Asia", "Asian", "Japan", "Anime"]],
    ["Japan", ["Asia", "Asian", "Japanese", "Anime"]],
    ["snowboarder", ["snow", "snowboard", "mountain", "cold", "ice", "ski", "winter", "athlete", "sport", "sports"]],
    ["American", ["USA", "America"]],
    ["lifter", ["lift", "workout", "exercise", "athlete", "weights", "strong", "buff", "muscular"]],
    ["Vulcan", ["space", "alien", "aliens", "nerd", "nerds", "logic", "logical", "dork", "dorks", "smart", "intelligent", "intelligence", "extraterrestrial"]],
    ["Oden", ["Norse", "Vikings", "Thor", "pagan", "deity", "gods", "medieval", "brabarian", "barbarians"]],
    ["dishware", ["silverware", "fork", "forks", "spoon", "spoons", "knife", "knives", "plate", "plates", "dishes", "dish", "food", "dining", "dinner", "tablecloth"]],
    ["Israel", ["Israeli", "Middle East", "Holy", "Judaism", "Islam", "Christianity", "Jerusalem"]],
    ["Israeli", ["Israel", "Middle East", "Holy", "Jerusalem"]],
    ["Chocolate"]
];
let bugObjects = bugWordsRaw.map((word)=>{
    let bwObj ={
        primary: word[0],
        syns: word[1],
        syns5: function(){
            // console.log(this.syns)
            if (this.syns.length<6){
                return this.syns;
            } else {
                let synsDump =[];
                while(synsDump.length<5){
                    let randSyn = Math.floor(Math.random()*this.syns.length);
                    if (!synsDump.includes(this.syns[randSyn])){
                        synsDump.push(this.syns[randSyn]);
                    };
                };
                return synsDump;
            };
        }
    };
    return bwObj;
});
let bugWords = bugWordsRaw.map((word)=>{
    return word[0].toUpperCase();
});
// let emojiNum = 0;

let stageArray = [renderStart, renderEmojis, renderInput, renderPicker];

let isLoading = false;



let container = document.querySelector("#container");
let containerHeader = document.querySelector("#container-header");
let headerTitle = document.querySelector("#container-h2");
let baseCard = document.querySelector("#base-card");
let resetButton = document.querySelector("#reset-button");
let canvas = document.querySelector("#canvas");


resetButton.addEventListener("click", resetButtonFn);


// renderEmojis();
renderSmiley();
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
    keywordsRaw = [];
    currentQuestion=null;
    userInputRaw = "";
    movieMatches =[];
    
    
    localStorage.setItem("stageMaster", JSON.stringify(stage));
    // localStorage.setItem("eNumMaster", JSON.stringify(emojiNum));
    localStorage.setItem("emojisMaster", JSON.stringify(chosenEmojis));
    localStorage.setItem("eligibleMaster", JSON.stringify(eligibleEmojis));
    localStorage.setItem("keywordsMaster", JSON.stringify(keywordsRaw));
    localStorage.setItem("questionMaster", JSON.stringify(currentQuestion));
    localStorage.setItem("inputMaster", JSON.stringify(userInputRaw));
    localStorage.setItem("moviestMaster", JSON.stringify(movieMatches));


    // call startupFunction
    
    stageFunction();
};

function buttonCheck(element, condition, fn){
    if (!condition){
        element.setAttribute("class", "nextButton off");
        element.removeEventListener("click", fn);
    } else {
        element.setAttribute("class", "nextButton on");
        element.addEventListener("click", fn, { once:true });
    };
};


function stageUpFn(){
    baseCard.innerHTML='';
    stage++
    localStorage.setItem("stageMaster", JSON.stringify(stage));
    stageFunction();
};

function textSplit(str){
    // let floatArray = str.split(/\s/g);
    // let symbols =["`","~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "]", "{", "}", "|", ",", "<", ">", ".", "/", "?", ";", ":", '"', "'"];
    // // console.log(floatCount)
    // floatArray = floatArray.filter((word)=>{
    //     if (word !== ""&&!symbols.includes(word)){
    //         return true;
    //     } else {
    //         return false;
    //     }
    // })
    // // console.log(floatCount)
    // return floatArray;
    let floatArray = str.split(" ");
    floatArray = floatArray.map((word)=>{
        word = word.replace(/'t/gi, "qxqxqx");
        word=word.replace(/'s/gi, "");
        word=word.replace(/\d/g, "");
        word=word.replace(/\W/g," ");
        word = word.replace(/qxqxqx/gi, "'t");

        return word.split(" ").filter((char)=>{
            if (char!==""){
            return true;
            } else{
                return false;
            }
        })
    }).flat();
    return floatArray
};

async function wordParser(str){


    // console.log(str)
    let keywordsFloat = [];
    let storedKeywords = JSON.parse(localStorage.getItem("keywordsMaster"));
    if (storedKeywords !== null){
        keywordsRaw = storedKeywords;
        storedKeywords.forEach((keyword)=>{
            keyword["syns5"]=function(){
                // console.log(this.syns)
                if (this.syns.length<6){
                    return this.syns;
                } else {
                    let synsDump =[];
                    while(synsDump.length<5){
                        let randSyn = Math.floor(Math.random()*this.syns.length);
                        if (!synsDump.includes(this.syns[randSyn])){
                            synsDump.push(this.syns[randSyn]);
                        };
                    };
                    return synsDump;
                };
            }
        })
    };

    let primaryArray = keywordsRaw.map((kwObj)=>{
        return kwObj.primary;
    })

    // let puncFn = (word)=>{
    //     let newWord = "";
    //     for (let n=0; n<word.length; n++){
    //         if (word[n]!=="."&&word[n]!==","&&word[n]!=="'"){
    //             newWord+=word[n];
    //         };
    //     };
    //     return newWord;
    // };
    // let splitArray = str.split(" ");

    // splitArray.push("Christmas")
    // console.log(splitArray)
    // splitArray = splitArray.map((word)=>{
    //     word=word.replace(/'s/g, "");
    //     word=word.replace(/\d/g, "");
    //     word=word.replace(/\W/g," ");
    //     return word.split(" ").filter((char)=>{
    //         if (char!==""){
    //         return true;
    //         } else{
    //             return false;
    //         }
    //     })
    // }).flat();

    let splitArray = textSplit(str);
    
    for (let i=0; i<splitArray.length; i++){
        // splitArray[i] = puncFn(splitArray[i]);
        if (bugWords.includes(splitArray[i].toUpperCase())){
            // let keywordObj = createKWObj(splitArray[i]);
            // keywordSluice.push(splitArray[i].toUpperCase());
            // keywordSluice.push(keywordObj);
            keywordSluice.push(bugObjects[bugWords.indexOf(splitArray[i].toUpperCase())]);
        } else {
            if (!primaryArray.includes(splitArray[i].toUpperCase())&&!stopwordsData.includes(splitArray[i].toLowerCase())&&!splitArray[i].includes("≊")){
                keywordsFloat.push(splitArray[i]);
            } else {
                keywordsTrash.push(splitArray[i]);
            }
        };
    };
    
    let promisesFloat = keywordsFloat.map(r => fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+r)
        .then((result)=>{
            if (result.status===200){
                return result.json();
            } else {
                let storedErrors = JSON.parse(localStorage.getItem("errorsMaster"));
                if (storedErrors!==null){
                    errorLogs = storedErrors;
                }
                errorLogs.push([r,result.status]);
                localStorage.setItem("errorsMaster", JSON.stringify(errorLogs));
                return "error";
            };
        }))
    // console.log(keywordsFloat)

    const waitTest = await Promise.allSettled(promisesFloat).then((response)=>{
        
        let results = response.filter((el)=>{
            if (el.value==="error"){
                return false;
            } else {
                return true;
            };
        });
        
        let kwObjsFloat = results.map((obj)=>{
            let newObj = createKWObj(obj.value[0].word);
            return newObj;
        });
        
        for (let i=0; i<results.length; i++){
            // let synTest =0;
            let synsFloat = [];
            
            let currentObj= objMatch(results[i].value[0].word);
            
            for (let x=0; x<results[i].value.length; x++){
                
                for (let n=0; n<results[i].value[x].meanings.length; n++){
                    // synTest++;
                    synsFloat=synsFloat.concat(results[i].value[x].meanings[n].synonyms);
                };
                    
                // console.log(currentObj)
                // console.log(synsFloat)
                synsFloat=[...new Set(synsFloat)]
                // console.log(synsFloat)
                currentObj.syns=synsFloat;
                // console.log(currentObj.syns)
                // if (synsFloat.length<6){
                //     console.log("less")
                //     currentObj.syns=synsFloat;
                // } else {
                //     console.log("more")
                //     let synsDump =[];
                //     while(synsDump.length<5){
                //         let randSyn = Math.floor(Math.random()*synsFloat.length);
                //         if (!synsDump.includes(synsFloat[randSyn])){
                //             synsDump.push(synsFloat[randSyn]);
                //         };
                //     };
                //     currentObj.syns=synsDump;
                // };
                
            };
            // console.log(currentObj)
            // console.log(currentObj.syns5())
            keywordSluice.push(currentObj);
            
        };
        
        function objMatch(word){
            for (let i=0; i<kwObjsFloat.length; i++){
                if (kwObjsFloat[i].primary===word){
                    return kwObjsFloat[i];
                };
            };
        };
    })
    // console.log("bub")

    function createKWObj(word){
        let wordObj={
            primary: word,
            syns: [],
            syns5: function(){
                // console.log(this.syns)
                if (this.syns.length<6){
                    return this.syns;
                } else {
                    let synsDump =[];
                    while(synsDump.length<5){
                        let randSyn = Math.floor(Math.random()*this.syns.length);
                        if (!synsDump.includes(this.syns[randSyn])){
                            synsDump.push(this.syns[randSyn]);
                        };
                    };
                    return synsDump;
                };
            }
        };
        // console.log(word)
        // console.log(wordObj)
        // console.log(wordObj.syns5())
        return wordObj
    };
};

function keywordSifter(){
    let primaryArray = keywordsRaw.map((kwObj)=>{
        return kwObj.primary;
    })
    
    for (let i=0; i<keywordSluice.length; i++){
        // console.log(keywordsRaw.includes(keywordSluice[i])+": "+keywordSluice[i])
        if (!primaryArray.includes(keywordSluice[i].primary)){
            keywordsRaw.push(keywordSluice[i]);
            primaryArray = keywordsRaw.map((kwObj)=>{
                return kwObj.primary;
            })
            // console.log(primaryArray)
        } else {
            keywordsTrash.push(keywordSluice[i]);
        };
    };
    keywordSluice = [];
    localStorage.setItem("keywordsMaster", JSON.stringify(keywordsRaw));
};

async function moviesCompiler(){
    console.log(keywordsRaw)
    // Test Variables
    let pullCount = 0;
    let runTime = 0;
    let isRunning = true
    timeTest()
    // /Test Variables

    let wordSoup = [];
    // let spentWords = [];
    let movieDump = [];
    // let movieSluice=[];
    let movieProms=[];
    // let moviePromsAdv=[];
    let titleWords = [];
    let moviePop=50;


    for (let i=0; i<keywordsRaw.length; i++){
        
        let randoSyns = keywordsRaw[i].syns5();
        // console.log(randoSyns)
        wordSoup.push(keywordsRaw[i].primary);
        wordSoup = wordSoup.concat(randoSyns);
        // console.log(wordSoup)
        // for (let n=0; n<randoSyns.length; n++){
        //     wordSoup.push(randoSyns[n]);
        // };
        // console.log(wordSoup)
    };
    wordSoup=[...new Set(wordSoup)];
    
    if (wordSoup.length<moviePop){
        titleWords=wordSoup;
    }else{
        while (titleWords.length<moviePop){
            let randoTitle = wordPicker();
            while (titleWords.includes(randoTitle)){
                randoTitle = wordPicker();
            };
            titleWords.push(randoTitle);
        };
    };
    console.log("Word Soup:")
    console.log(wordSoup)
    breaker=0
    while (movieMatches.length<titleWords.length){
        // if (breaker>=1){
        //     break;
        // }
        // if (wordSoup.length===0){
        //     break;
        // } else {
        //     const moviesAdd = await moviePusher();
        //     dumpProcessor();

        // };
        // breaker++;
        if (breaker>=1){
            break;
        }
        const moviesAdd = await moviePusher();
        // THIS IS WHERE THE PROBLEM IS
        // THE MOVIEMATCH ADD IS IN THE DUMPPROCESSOR
        breaker++
    };
    dumpProcessor();
    console.log(movieMatches)

    async function moviePusher(){
        let moviesPending =[];
        
        console.log("Title Words:")
        console.log(titleWords);
        const initPulls = await starterPulls(titleWords);
        console.log("Initial Promises")
        console.log(movieProms)
        const waitProms = await Promise.allSettled(movieProms).then((data)=>{
            // let idFloat = [];
            // if (moviesFloat>0){
            //     idFloat=moviesFloat.map((movie))
            // }
            let mTest = 0;
            let aTest =0;
            data.forEach((pull)=>{
                
                let titleWord = titleWords[data.indexOf(pull)]
                if (pull.value.total_pages>1){
                    let rando = Math.ceil(Math.random()*pull.value.total_pages);
                    let valueProm = moviePull(titleWord, rando);
                    // Let's see if I can set an object's property to a promise,
                    // Then push that object into an array
                    // Then create a mapped array of only that object's value that is a promise
                    // then promise all that map array
                    pullObj = {
                        package: valueProm,
                        pullTitle: titleWord,
                    }
                    moviesPending.push(pullObj);
                } else {
                    pullObj = {
                        package: pull,
                        pullTitle: titleWord,
                    }
                    if (pull.value.total_result>0){
                        movieDump.push(pullObj);
                    }
                }
            })
            
        });
        // console.log("Movies Pending (movie objects with promise values):")
        // console.log(moviesPending)
        if (moviesPending.length>0){
            let pendingProms = moviesPending.map((obj)=>{
                return obj.package;
            });
            // console.log("Movie Promises (promises extracted from objects)");
            // console.log(pendingProms)
            const waitPromsAdv = await Promise.allSettled(pendingProms).then((response)=>{
                for (let i=0; i<response.length; i++){
                    moviesPending[i].package = response[i];
                    movieDump.push(moviesPending[i]);
                };
            });
        };
        console.log(movieDump)
    };

    function dumpProcessor(){
        movieDump.forEach((pullGroup)=>{
            pullGroup.package.value.results.forEach((movie)=>{
                let movieObj = {
                    title: movie.title,
                    data: movie,
                    id: movie.id,
                    score: 0,
                }
                movieObj["titleSplit"]=splitAssign(movie.title);
                movieObj["oTitleSplit"]=splitAssign(movie.original_title);
                movieObj["plotSplit"]=splitAssign(movie.overview);
                unifiedSplit=movieObj.titleSplit.concat(movieObj.oTitleSplit, movieObj.plotSplit);
                movie["wordSoup"]=[...new Set(unifiedSplit)]

                // console.log(movieObj);

                movieMatches.push(movieObj);

                function splitAssign(str){
                    let strSplit = textSplit(str);
                    return [...new Set(strSplit)].filter((word)=>{
                        if (stopwordsData.includes(word.toLowerCase())){
                            return false;
                        } else{
                            return true;
                        };
                    });
                }
            });
        });
    }
    
    async function starterPulls(array){
        array.forEach((titleWordVar)=>{
            movieProms.push(moviePull(titleWordVar, 1));
            // console.log("Let's see if I can read this:")
            // console.log(moviePull(titleWordVar, 1))
        })
    };

    async function moviePull (word, page){
        // console.log("Pull Check:")
        // console.log(word)
        // console.log(page)
        let movieUrl = "https://api.themoviedb.org/3/search/movie?api_key=654175309f8dda54d6e0ea0c7706fa04&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&query="+word+"&page="+page;
        // console.log(movieUrl)
        // array.push(fetch(movieUrl).then((response)=>{
        return fetch(movieUrl).then((response)=>{
            // console.log(response)
            pullCount++;
            if (response.status===200){
                return response.json();
            } else {
                errorLogs.push(response.status, word, "movie");
            };
        })
        // .then((data)=>{
        //     console.log("Title: "+word)
        //     console.log(data)
        // })
        // )
    };

    function wordPicker(){
        return wordSoup[Math.floor(Math.random()*wordSoup.length)];
    };

    

    // Time Test Results
    function timeTest(){
        let testTimer = setInterval(()=>{
            runTime++;
            if (!isRunning){
                clearInterval(testTimer);
            };
        }, 10);
    };
    runTime = runTime/100;
    isRunning = false;
    console.log(runTime)
    console.log(pullCount)
}


// Render Functions

function renderSmiley(){
    
    for (let i=0; i<mapTotal.length; i++){
        let ul = document.createElement("ul");
        ul.setAttribute("class", "mapRow");
        for (let n=0; n<mapTotal[i].length; n++){
            // let coordinates = [i, n]
            let currentObj = null;
            let li = document.createElement("li");
            
            // li.dataset.coordinates = i+","+n;
            for (let x=0; x<MapColor.instances.length; x++){
                // console.log(MapColor.instances[x])
                for (let y=0; y<MapColor.instances[x].array.length; y++){
                    // console.log(i)
                    // console.log(n)
                    // console.log(MapColor.instances[x].array[y][0], MapColor.instances[x].array[y][1])
                    if (MapColor.instances[x].array[y][0]===i&&MapColor.instances[x].array[y][1]===n){
                        currentObj=MapColor.instances[x];
                    };
                };
            };
            if (currentObj!==null){
                li.setAttribute("class", "mapTile "+currentObj.clss);
            } else {
                li.setAttribute("class", "mapTile");
            };
            ul.appendChild(li);
        };
        canvas.appendChild(ul);
    };
};

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

    randoTitle.setAttribute("class", "h3");
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

};

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

    emojiTitle.setAttribute("class", "h3");
    
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

    async function emojiButtonFn(){
        
        let gridList = document.getElementsByClassName("emojiGrid");
        let choiceSlots = document.getElementsByClassName("choiceSlot");
        isLoading = true;
        renderLoad();
        for (let i=0; i<gridList.length; i++){
            gridList[i].removeEventListener("click", addEmoji);
        };
        for (let i=0; i<choiceSlots.length; i++){
            choiceSlots[i].removeEventListener("click", removeEmoji);
        };
        // const loadTest =  await new Promise(resolve => setTimeout(resolve, 5000));

        for (let i=0; i<chosenEmojis.length; i++){
            const wait1 = await wordParser(chosenEmojis[i].name);
            if (chosenEmojis[i].group!=="activities"){
                const wait2 = await wordParser(chosenEmojis[i].group);
            }
            
        };
        // console.log("bub")
        // console.log(errorLogs)
        // console.log(keywordSluice)
        keywordSifter();
        console.log(keywordsRaw)
        // console.log(keywordsTrash)
        isLoading = false;
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
    let wordMin = 10;
    let wordMax =250;
    

    let storedQuestion = JSON.parse(localStorage.getItem("questionMaster"));
    let storedInput = JSON.parse(localStorage.getItem("inputMaster"));
    if (storedQuestion!==null){
        currentQuestion = storedQuestion;
    };
    if (storedInput!==null){
        userInputRaw = storedInput;
    };
    // let charN = 0;
    let inputBox = document.createElement("div");
    let userForm = document.createElement("form");
    // let question = document.createElement("label");
    let questionDiv = document.createElement("div");
    let qWrapDiv = document.createElement("div");
    let questionEl = document.createElement("h3");
    let refresh = document.createElement("i");
    let userInputEl = document.createElement("textarea");
    let wordMaxEl = document.createElement("p");
    let button = document.createElement("div");

    let wordCount = ()=>{
        // console.log(userInputEl.value)
        if (userInputEl.value!==undefined&&userInputEl.value!==""){
            let countFloat = textSplit(userInputEl.value);
            return countFloat.length
            // let floatCount = userInputEl.value.split(/\s/g);
            // let symbols =["`","~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "]", "{", "}", "|", ",", "<", ">", ".", "/", "?", ";", ":", '"', "'"];
            // // console.log(floatCount)
            // floatCount = floatCount.filter((word)=>{
            //     if (word !== ""&&!symbols.includes(word)){
            //         return true;
            //     } else {
            //         return false;
            //     }
            // })
            // // console.log(floatCount)
            // return floatCount.length;
        } else {
            return 0;
        };
    };
    

    let inputCondition = ()=>{
        if (wordCount()>=wordMin&&wordCount()<=wordMax){
            return true;
        } else {
            return false;
        }
    };
    
    questionDiv.setAttribute("class", "questionDiv");
    refresh.setAttribute("class", "material-icons customAria");
    qWrapDiv.setAttribute("class", "qWrapDiv");
    questionEl.setAttribute("class", "h3");
    inputBox.setAttribute("class", "inputBox");
    // wordMaxEl.setAttribute("class", "wordMaxEl");
    userForm.setAttribute("class", "userForm");
    // question.setAttribute("class", "question");
    userInputEl.setAttribute("class", "userInputEl");
    button.setAttribute("class", "nextButton");

    // userInputEl.setAttribute("maxLength", "500");
    userInputEl.setAttribute("placeholder", "Ten word minimum...");
    if (userInputRaw.length>0){
        userInputEl.value = userInputRaw;
    };
    // userInputEl.dataset.wordMax = "250";
    button.setAttribute("style", "align-self: end");

    headerTitle.textContent="Time to Type";

    
    if (currentQuestion===null){
        currentQuestion=questionPicker(currentQuestion);
    } else {
        questionEl.textContent = currentQuestion.question;
    }
    refresh.textContent="refresh"


    // question.textContent = "What kind of movies are you into?"
    // console.log(wordCount()+"/"+wordMax+" Words")
    // wordMaxEl.textContent = wordCount()+"/"+wordMax+" Words"
    inputFnMini()
    button.textContent = "NEXT"

    qWrapDiv.appendChild(questionEl);
    questionDiv.appendChild(qWrapDiv);
    questionDiv.appendChild(refresh);
    userForm.appendChild(questionDiv);
    userForm.appendChild(userInputEl);
    userForm.appendChild(wordMaxEl);
    userForm.appendChild(button);
    inputBox.appendChild(userForm);
    baseCard.appendChild(inputBox);

    userInputEl.addEventListener("keydown", inputFn);
    refresh.addEventListener("click", questionPicker);

    

    function inputFnMini(){
        if (inputCondition()){
            wordMaxEl.setAttribute("class", "wordMaxEl wcTrue");
        } else {
            wordMaxEl.setAttribute("class", "wordMaxEl wcFalse");
        };
        buttonCheck(button, inputCondition(), inputButtonFn);
        wordMaxEl.textContent = wordCount()+"/"+wordMax+" Words";
    };

    function inputFn(event){
        let key = event.keyCode || event.charCode;
        // console.log(wordCount())
        if (inputCondition()){
            wordMaxEl.setAttribute("class", "wordMaxEl wcTrue");
            if (wordCount()===wordMax){
                if (key !== 8&&key !== 46){
                    event.preventDefault();
                };
            };
            // call buttonChecker/add event listener/buttonfunction
        } else {
            
            if (wordCount()>=wordMax){
                if (key !== 8&&key !== 46){
                    event.preventDefault();
                };
            };
            
            wordMaxEl.setAttribute("class", "wordMaxEl wcFalse");
        };

        wordMaxEl.textContent = wordCount()+"/"+wordMax+" Words";
        // localStorage.setItem("inputMaster", userInputRaw);
        localStorage.setItem("inputMaster", JSON.stringify(userInputEl.value));
        buttonCheck(button, inputCondition(), inputButtonFn);
    };
    
    function questionPicker(question){
        let output = randoQ();
        if (question!==null){
            while (output.index===question.index){
                output = randoQ();
            };
        };
        localStorage.setItem("questionMaster", JSON.stringify(output));
        questionEl.textContent = output.question;
        userInputEl.value="";
        inputFnMini()
        localStorage.setItem("inputMaster", JSON.stringify(userInputEl.value));
        return output;

        function randoQ(){
            return questionsMain[Math.floor(Math.random()*questionsMain.length)];
        };
    };

    async function inputButtonFn(){
        console.log("bub")
        let wordSplit = textSplit(userInputEl.value);
        isLoading = true;
        renderLoad();
        for (let i=0; i<wordSplit.length; i++){
            const wait2 = await wordParser(wordSplit[i]);
        }
        

        console.log(errorLogs)
        console.log(keywordSluice)
        keywordSifter();
        console.log(keywordsRaw)
        console.log(keywordsTrash)

        // Movie Find Function
        const movieWait = await moviesCompiler();
        isLoading = false;
        stageUpFn();
    };
};

function renderPicker(){

}

function renderLoad(){
    setTimeout(()=>{
        if (isLoading){
            baseCard.innerHTML="";
            let loadCounter = 4;
            let loadDiv = document.createElement("div");
            let staticDiv = document.createElement("div");
            let p = document.createElement("p");
            // let span = document.createElement("span");


            loadDiv.setAttribute("class", "loadDiv");
            staticDiv.setAttribute("class", "staticDiv");

            // p.textContent = "Loading";
            // span.textContent = ""
            loadText()
            loadTimer()


            staticDiv.appendChild(p);
            loadDiv.appendChild(staticDiv);
            // loadDiv.appendChild(span);
            baseCard.appendChild(loadDiv);

            function loadTimer(){
                let timer = setInterval(()=>{
                    if (isLoading===false){
                        clearInterval(timer);
                    } else{
                        loadText();
                    };
                }, 500);
            };
            function loadText(){
                let baseText = "Loading";
                if (loadCounter<4){
                    for (let i=0; i<loadCounter; i++){
                        baseText+=".";
                    };
                    loadCounter++;
                } else {
                    loadCounter = 1;
                };
                p.textContent = baseText;
            };
        };
    }, 500);
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
let testPush =[];

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


// fetch("https://api.dictionaryapi.dev/api/v2/entries/en/savouring").then((response)=>{
//     console.log("hubba")
//     if (response.status===200){
//         return response.json();
//     } else {
//         console.log("Vegetables: the forbidden fruit.")
//     }
// }).then((data)=>{
//     console.log(data)
// });






fetch("https://api.themoviedb.org/3/search/movie?api_key=654175309f8dda54d6e0ea0c7706fa04&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&query=alligator")
.then((response)=>{
    if (response.status===200){
        return response.json();
    }
}).then((data)=>{
    console.log(data);
    // console.log(data.results[0].overview)
    // fetch("https://api.themoviedb.org/3/movie/"+data.results[0].id+"/external_ids?api_key=654175309f8dda54d6e0ea0c7706fa04")
    // .then((response)=>{
    //     if (response.status===200){
    //         return response.json()
    //     } else{
    //         return "error"
    //     }

    // }).then((data)=>{
    //     // console.log(data)
    //     fetch("http://www.omdbapi.com/?apikey=1aa15ab1&type=movie&plot=full&i="+data.imdb_id).then((response)=>{
    //         if (response.status===200){
    //             return response.json()
    //         } else{
    //             return "error"
    //         }
    
    //     }).then((data)=>{
    //         console.log(data)
    //         console.log(data.Plot)
    //     })
    // })
})












































































































































































































































































function fetchTMDB() {
    fetch("https://api.themoviedb.org/3/movie/1491?api_key=654175309f8dda54d6e0ea0c7706fa04&language=en-US")
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Failed to fetch data from TMDb");
        }
      })
      .then((data) => {
        renderTMDB(data); // Call the renderTMDB function with the fetched data
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  function renderTMDB(movieData) {
    let { title, poster_path, overview } = movieData;
    //this is the base url for all posters... it adds poster_path data to the end and grabs the poster for the movie
    let basePosterURL = 'https://image.tmdb.org/t/p/w500';
    let tmdbContainer = document.createElement('div');
    document.body.appendChild(tmdbContainer); // Append to the document body
  
    tmdbContainer.classList.add('container', 'movie');
    tmdbContainer.innerHTML = `
      <img src="${basePosterURL + poster_path}" alt="${title}">
      <div class='movie-title'>
        <h1>${title}</h1>
      </div>
      <div class="overview">
        <h2>Plot</h2>
        ${overview}
      </div>
    `;
  }




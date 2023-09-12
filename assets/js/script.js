let rootEl = document.querySelector(":root");
let bodyEl = document.querySelector("#body");
let colorSwitchEl = document.querySelector("#colorSwitch");
let playPauseEl = document.querySelector("#play-pause");

class ColorVar {
    static instances = [];
    constructor(label, oCode) {
        this.label = label;
        this.oCode = oCode;
        ColorVar.instances.push(this);
    }
    changeFn() {
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
    };
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
let movieKeywords =[];
let mkwSelections = [];
let winner = null;
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
    ["fencer", ["fencing", "sword", "spot", "athlete"]]
];
let bugObjects = bugWordsRaw.map((word)=>{
    let bwObj ={
        primary: word[0],
        syns: word[1],
        syns5: function(){
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

let stageArray = [renderStart, renderEmojis, renderInput, renderPicker, renderMovieCard];

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

// Misc. Functions
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

    baseCard.innerHTML = '';

    isLoading = false;

    stage = 0;
    chosenEmojis = [];
    eligibleEmojis = [];
    keywordsRaw = [];
    currentQuestion=null;
    userInputRaw = "";
    movieMatches =[];
    movieKeywords =[];
    mkwSelections = [];
    winner = null;
    
    
    localStorage.setItem("stageMaster", JSON.stringify(stage));
    localStorage.setItem("emojisMaster", JSON.stringify(chosenEmojis));
    localStorage.setItem("eligibleMaster", JSON.stringify(eligibleEmojis));
    localStorage.setItem("keywordsMaster", JSON.stringify(keywordsRaw));
    localStorage.setItem("questionMaster", JSON.stringify(currentQuestion));
    localStorage.setItem("inputMaster", JSON.stringify(userInputRaw));
    localStorage.setItem("moviesMaster", JSON.stringify(movieMatches));
    localStorage.setItem("mkwMaster", JSON.stringify(movieKeywords));
    localStorage.setItem("selectionsMaster", JSON.stringify(mkwSelections));
    localStorage.setItem("winnerMaster", JSON.stringify(winner));

    
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


    
    let keywordsFloat = [];
    let storedKeywords = JSON.parse(localStorage.getItem("keywordsMaster"));
    if (storedKeywords !== null){
        keywordsRaw = storedKeywords;
        storedKeywords.forEach((keyword)=>{
            keyword["syns5"]=function(){
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
            };
        })
    };

    let primaryArray = keywordsRaw.map((kwObj)=>{
        return kwObj.primary;
    });

    let splitArray = textSplit(str);
    
    for (let i=0; i<splitArray.length; i++){
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
            let synsFloat = [];
            
            let currentObj= objMatch(results[i].value[0].word);
            
            for (let x=0; x<results[i].value.length; x++){
                
                for (let n=0; n<results[i].value[x].meanings.length; n++){
                    synsFloat=synsFloat.concat(results[i].value[x].meanings[n].synonyms);
                };
                    
                
                synsFloat=[...new Set(synsFloat)]
                currentObj.syns=synsFloat;
                
            };
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

    function createKWObj(word){
        let wordObj={
            primary: word,
            syns: [],
            syns5: function(){
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
        return wordObj
    };
};

function keywordSifter(){
    let primaryArray = keywordsRaw.map((kwObj)=>{
        return kwObj.primary;
    })
    
    for (let i=0; i<keywordSluice.length; i++){
        if (!primaryArray.includes(keywordSluice[i].primary)){
            keywordsRaw.push(keywordSluice[i]);
            primaryArray = keywordsRaw.map((kwObj)=>{
                return kwObj.primary;
            });
        } else {
            keywordsTrash.push(keywordSluice[i]);
        };
    };
    keywordSluice = [];
    localStorage.setItem("keywordsMaster", JSON.stringify(keywordsRaw));
};

async function moviesCompiler(){
    // Test Variables
    // let pullCount = 0;
    // let runTime = 0;
    // let isRunning = true
    // timeTest()
    // /Test Variables

    let wordSoup = [];
    let movieDump = [];
    let movieProms=[];
    let titleWords = [];
    let moviePop=50;


    for (let i=0; i<keywordsRaw.length; i++){
        
        let randoSyns = keywordsRaw[i].syns5();
        wordSoup.push(keywordsRaw[i].primary);
        wordSoup = wordSoup.concat(randoSyns);
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
    const moviesAdd = await moviePusher();
    dumpProcessor();
    localStorage.setItem("moviesMaster", JSON.stringify(movieMatches));

    async function moviePusher(){
        let moviesPending =[];
        const initPulls = await starterPulls(titleWords);
        const waitProms = await Promise.allSettled(movieProms).then((data)=>{
            data.forEach((pull)=>{
                
                let titleWord = titleWords[data.indexOf(pull)]
                if (pull.value.total_pages>1){
                    let popValue= 3;
                    let actualValue=()=>{
                        if (pull.value.total_pages>=popValue){
                            return popValue;
                        } else{
                            return pull.value.total_pages;
                        };
                    };
                    let rando = Math.ceil(Math.random()*actualValue());
                    let valueProm = moviePull(titleWord, rando);
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
        if (moviesPending.length>0){
            let pendingProms = moviesPending.map((obj)=>{
                return obj.package;
            });
            const waitPromsAdv = await Promise.allSettled(pendingProms).then((response)=>{
                for (let i=0; i<response.length; i++){
                    moviesPending[i].package = response[i];
                    movieDump.push(moviesPending[i]);
                };
            });
        };
    };

    function dumpProcessor(){
        movieDump.forEach((pullGroup)=>{
            pullGroup.package.value.results.forEach((movie)=>{
                let yearSlice = movie.release_date.slice(0,4)
                let movieObj = {
                    title: movie.title,
                    data: movie,
                    id: movie.id,
                    poster: 'https://image.tmdb.org/t/p/w500'+movie.poster_path,
                    posterCheck: movie.poster_path,
                    altPlot: movie.overview,
                    altYear: yearSlice,
                    score: 0,
                }
                
                movieObj["titleSplit"]=splitAssign(movie.title);
                movieObj["oTitleSplit"]=splitAssign(movie.original_title);
                movieObj["plotSplit"]=splitAssign(movie.overview);
                unifiedSplit=movieObj.titleSplit.concat(movieObj.plotSplit);
                movieObj["wordSoup"]=[...new Set(unifiedSplit)]

                

                movieMatches.push(movieObj);

                function splitAssign(str){
                    let strSplit = textSplit(str);
                    return [...new Set(strSplit)].map((word)=>{
                        return word.toLowerCase();
                    }).filter((word)=>{
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
        })
    };

    async function moviePull (word, page){
        let movieUrl = "https://api.themoviedb.org/3/search/movie?api_key=654175309f8dda54d6e0ea0c7706fa04&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&query="+word+"&page="+page+"&without_genres=99";
        return fetch(movieUrl).then((response)=>{
            // pullCount++;
            if (response.status===200){
                return response.json();
            } else {
                errorLogs.push(response.status, word, "movie");
            };
        })
    };

    function wordPicker(){
        return wordSoup[Math.floor(Math.random()*wordSoup.length)];
    };

    

    // Time Test Results
    // function timeTest(){
    //     let testTimer = setInterval(()=>{
    //         runTime++;
    //         if (!isRunning){
    //             clearInterval(testTimer);
    //         };
    //     }, 10);
    // };
    // runTime = runTime/100;
    // isRunning = false;
    // console.log(runTime)
    // console.log(pullCount)
}

function mkwTabulator(){
    let mkwSluice=[];
    let tabMin = 6;
    let mkwMax = 100;
    movieMatches.forEach((movie)=>{
        mkwSluice= mkwSluice.concat(movie.plotSplit);
    });

    let movieKeywordsFloat=[...new Set(mkwSluice)].map((mkw)=>{
        let mkwObj={
            word: mkw,
            tab: 0,
        };
        movieMatches.forEach((movie)=>{
            if (movie.plotSplit.includes(mkw)){
                mkwObj.tab++;
            };
        });

        return mkwObj;
    }).filter((mkwObject)=>{
        if (mkwObject.tab>=tabMin){
            return true;
        } else{
            return false;
        }
    }).sort(compareTabs);

    if (movieKeywordsFloat.length>mkwMax){
        while (movieKeywords.length<mkwMax){
            let mkwRando = ()=>{
               return movieKeywordsFloat[Math.floor(Math.random()*movieKeywordsFloat.length)]
            };
            let mkwRandoOP = mkwRando();
            while (movieKeywords.includes(mkwRandoOP)){
                mkwRandoOP = mkwRando();
            }
            movieKeywords.push(mkwRandoOP);
        };
    } else{
        movieKeywords=movieKeywordsFloat
    }
   
    localStorage.setItem("mkwMaster", JSON.stringify(movieKeywords));

    function compareTabs(a,b){
        return a.tab-b.tab;
    }
};

async function scoreTabulator(){
    let storedKeywords = JSON.parse(localStorage.getItem("keywordsMaster"));
    if (storedKeywords !== null){
        keywordsRaw = storedKeywords;
        storedKeywords.forEach((keyword)=>{
            keyword["syns5"]=function(){
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


    let synsSluice=[];
    let finalists = movieMatches.filter((movie)=>{
        let isIncluded = false;
        let onlySelectorWords = mkwSelections.map((item)=>{
            return item.word;
        });
        onlySelectorWords.forEach((word)=>{
            if (movie.wordSoup.includes(word)){
                isIncluded = true;
            }
        })
        if (isIncluded){
            return true;
        } else{
            return false;
        };
    })


    let selectedSluice = mkwSelections.map((mkw)=>{
        return mkw.word
    });
    let primarySluice = keywordsRaw.map((wordGroup)=>{
        return wordGroup.primary;
    }).filter((word)=>{
        if (selectedSluice.includes(word)){
            return false;
        } else{
            return true;
        };
    });

    primarySluice=[...new Set(primarySluice)];
    storedKeywords.forEach((wordGroup)=>{
        if (wordGroup.syns.length<=5){
            synsSluice=synsSluice.concat(wordGroup.syns)
        } else {
            synsSluice=synsSluice.concat(wordGroup.syns5())
        }
    });
    synsSluice = [...new Set(synsSluice)].filter((word)=>{
        if (primarySluice.includes(word)||selectedSluice.includes(word)){
            return false;
        } else {
            return true;
        };
    });

    

    finalists.forEach((movie)=>{
        let mkwPlotFiltered = movie.plotSplit.filter((word)=>{
            if (movie.titleSplit.includes(word)){
                return false;
            } else{
                return true;
            }
        })
        let mkwScores = [[movie.titleSplit, 2], [mkwPlotFiltered, 1]];
        let keywordScores = [[selectedSluice, 4], [primarySluice, 2], [synsSluice, 1]];
        mkwScores.forEach((movieSplit)=>{
            keywordScores.forEach((sluice)=>{
                arrayChecker(movie, movieSplit, sluice)
            });
        });
    });
    finalists.sort(movieScoreCompare).reverse();
    let highScore = finalists[0].score;
    let winners = finalists.filter((movie)=>{
        if (movie.score>=highScore){
            return true;
        } else {
            return false;
        };
    });

    if (winners.length===1){
        winner=winners[0];
    } else {
        winner = winners[Math.floor(Math.random()*winners.length)]
    };

    localStorage.setItem("winnerMaster", JSON.stringify(winner));
    

    function arrayChecker(movie, movieArray, keywordArray){
        let points = movieArray[1]*keywordArray[1];
        movieArray[0].forEach((movieStr)=>{
            keywordArray[0].forEach((keyword)=>{
                if (movieStr.includes(keyword)){
                    
                    movie.score+=points;
                };
            });
        });
    };

    function movieScoreCompare(a, b){
        return a.score-b.score;
    };
};


// Render Functions

function renderSmiley(){
    
    for (let i=0; i<mapTotal.length; i++){
        let ul = document.createElement("ul");
        ul.setAttribute("class", "mapRow");
        for (let n=0; n<mapTotal[i].length; n++){
            let currentObj = null;
            let li = document.createElement("li");
            
            
            for (let x=0; x<MapColor.instances.length; x++){
                for (let y=0; y<MapColor.instances[x].array.length; y++){
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
        emojiRandomizer(emojiNum);
        stageUpFn();
    };

};

function emojiRandomizer(eNum){
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

        for (let i=0; i<chosenEmojis.length; i++){
            const wait1 = await wordParser(chosenEmojis[i].name);
            if (chosenEmojis[i].group!=="activities"){
                const wait2 = await wordParser(chosenEmojis[i].group);
            }
            
        };

        keywordSifter();
        isLoading = false;
        stageUpFn();
    };

    function renderEmojiGrid(){
        let n=0;
        let emojiRows = [];
        let subUls = [];
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
    let inputBox = document.createElement("div");
    let userForm = document.createElement("form");
    let questionDiv = document.createElement("div");
    let qWrapDiv = document.createElement("div");
    let questionEl = document.createElement("h3");
    let refresh = document.createElement("i");
    let userInputEl = document.createElement("textarea");
    let wordMaxEl = document.createElement("p");
    let button = document.createElement("div");

    let wordCount = ()=>{
        if (userInputEl.value!==undefined&&userInputEl.value!==""){
            let countFloat = textSplit(userInputEl.value);
            return countFloat.length;
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
    userForm.setAttribute("class", "userForm");
    
    userInputEl.setAttribute("class", "userInputEl");
    button.setAttribute("class", "nextButton");

    
    userInputEl.setAttribute("placeholder", "Ten word minimum...");
    if (userInputRaw.length>0){
        userInputEl.value = userInputRaw;
    };
    button.setAttribute("style", "align-self: end");

    headerTitle.textContent="Time to Type";

    
    if (currentQuestion===null){
        currentQuestion=questionPicker(currentQuestion);
    } else {
        questionEl.textContent = currentQuestion.question;
    }
    refresh.textContent="refresh";

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
        if (inputCondition()){
            wordMaxEl.setAttribute("class", "wordMaxEl wcTrue");
            if (wordCount()===wordMax){
                if (key !== 8&&key !== 46){
                    event.preventDefault();
                };
            };
        } else {
            
            if (wordCount()>=wordMax){
                if (key !== 8&&key !== 46){
                    event.preventDefault();
                };
            };
            
            wordMaxEl.setAttribute("class", "wordMaxEl wcFalse");
        };

        wordMaxEl.textContent = wordCount()+"/"+wordMax+" Words";
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
        let wordSplit = textSplit(userInputEl.value);
        isLoading = true;
        renderLoad();
        for (let i=0; i<wordSplit.length; i++){
            const wait2 = await wordParser(wordSplit[i]);
        }
        

        
        keywordSifter();

        // Movie Find Function
        const movieWait = await moviesCompiler();
        mkwTabulator();
        isLoading = false;
        stageUpFn();
    };
};

function renderPicker(){
    let storedMatches = JSON.parse(localStorage.getItem("moviesMaster"));
    if (storedMatches!==null){
        movieMatches=storedMatches;
    };
    let storedMkwSelections=JSON.parse(localStorage.getItem("selectionsMaster"));
    if (storedMkwSelections!==null){
        mkwSelections=storedMkwSelections;
    };
    let storedMKW = JSON.parse(localStorage.getItem("mkwMaster"));
    if (storedMKW!==null){
        movieKeywords=storedMKW;
    };
    for (let i=0; i<movieKeywords.length; i++){
        movieKeywords[i]["index"]=i;
    }
    let selectionsMin = 5;
    let mkwCondition = ()=>{
        if (mkwSelections.length<selectionsMin){
            return false;
        } else {
            return true;
        };
    };

    let titleCard = document.createElement("div");
    let h3 = document.createElement("h3");
    let button = document.createElement("button");
    let listBox = document.createElement("div");
    let ul = document.createElement("ul");

    titleCard.setAttribute("class", "mkwTitleCard");
    h3.setAttribute("class", "h3");
    listBox.setAttribute("class", "listBox");
    ul.setAttribute("class", "mkwUl");

    h3.textContent = "Choose at least "+selectionsMin+" keywords that resonate you."
    headerTitle.textContent = "Choose Your Words"

    button.textContent = "NEXT"

    buttonCheck(button, mkwCondition(), mkwButtonFn);

    renderList();

    titleCard.appendChild(h3);
    titleCard.appendChild(button);

    listBox.appendChild(ul);

    baseCard.appendChild(titleCard);
    baseCard.appendChild(listBox);

    async function mkwButtonFn (){
        isLoading=true;

        const waiting = await scoreTabulator();

        isLoading=false;
        stageUpFn();
    }

    function renderList(){
        for (let i=0; i<movieKeywords.length; i++){
            let li = document.createElement("li");

            let onlyWords=mkwSelections.map((item)=>{
                return item.word;
            })

            if (onlyWords.includes(movieKeywords[i].word)){
                li.setAttribute("class", "mkwLi selected");
            } else {
                li.setAttribute("class", "mkwLi");
            }
            
            li.dataset.index=i;
            li.textContent = movieKeywords[i].word;

            ul.appendChild(li);
            li.addEventListener("click", mkwSelect);
        };
    };
    function mkwSelect(event){
        element=event.target;
        let currentMKW = null;
        movieKeywords.forEach((mkw)=>{
            if (~~element.dataset.index===mkw.index){
                currentMKW = mkw;
            }
        });
        let selectionWords=mkwSelections.map((selection)=>{
            return selection.word;
        });
        if (!selectionWords.includes(currentMKW.word)){
            element.setAttribute("class", "mkwLi selected");
            mkwSelections.push(currentMKW);
        } else {
            element.setAttribute("class", "mkwLi");
            for (let i=0; i<mkwSelections.length; i++){
                if (mkwSelections[i].word===currentMKW.word){
                    mkwSelections.splice(i, 1);
                };
            };
        };
        localStorage.setItem("selectionsMaster", JSON.stringify(mkwSelections));
        buttonCheck(button, mkwCondition(), mkwButtonFn);
    };
};

async function renderMovieCard(){
    let storedWinner = JSON.parse(localStorage.getItem("winnerMaster"));
    if (storedWinner!==null){
        winner = storedWinner
    };

    let fullCard = document.createElement("div");
    let sideCard = document.createElement("div");

    let moviePoster = document.createElement("img");
    let noPoster = document.createElement("div");

    let detailsCard = document.createElement("div");
    let titleDiv = document.createElement("div");
    let movieTitle = document.createElement("h4");
    
    let directorDiv = document.createElement("div");
    let directorLabel = document.createElement("h5");
    let directorText = document.createElement("p");

    let castDiv = document.createElement("div");
    let castLabel = document.createElement("h5");
    let castText = document.createElement("p");

    let plotDiv = document.createElement("div");
    let plotText = document.createElement("p");

    fullCard.setAttribute("class", "fullCard");
    sideCard.setAttribute("class", "sideCard")


    moviePoster.setAttribute("src", winner.poster);
    moviePoster.setAttribute("alt", winner.title+" Poster");

    movieTitle.setAttribute("class", "h4");

    titleDiv.setAttribute("class", "textSection");
    directorDiv.setAttribute("class", "textSection");
    castDiv.setAttribute("class", "textSection");

    directorLabel.setAttribute("class", "h5");
    castLabel.setAttribute("class", "h5");

    plotDiv.setAttribute("class", "plotDiv")

    if (winner.posterCheck!==null){
        moviePoster.setAttribute("class", "poster");
    } else {
        moviePoster.setAttribute("class", "nv");
    }
   
    noPoster.setAttribute("class", "noPoster");
    noPoster.textContent = "Poster Not Found";
    plotText.textContent=winner.altPlot;

    movieTitle.textContent = winner.title+" ("+winner.altYear+")";
    


    castDiv.appendChild(castLabel);
    castDiv.appendChild(castText);
    
    directorDiv.appendChild(directorLabel);
    directorDiv.appendChild(directorText);

    titleDiv.appendChild(movieTitle);

    detailsCard.appendChild(titleDiv);

    plotDiv.appendChild(plotText);

    sideCard.appendChild(detailsCard);
    sideCard.appendChild(plotDiv);

    if (winner.posterCheck!==null){
        fullCard.appendChild(moviePoster);
    } else {
        noPoster.appendChild(moviePoster);
        fullCard.appendChild(noPoster);
    };
    
    fullCard.appendChild(sideCard);

    baseCard.appendChild(fullCard);
}

function renderLoad(){
    setTimeout(()=>{
        if (isLoading){
            baseCard.innerHTML="";
            let loadCounter = 4;
            let loadDiv = document.createElement("div");
            let staticDiv = document.createElement("div");
            let p = document.createElement("p");


            loadDiv.setAttribute("class", "loadDiv");
            staticDiv.setAttribute("class", "staticDiv");

            
            loadText()
            loadTimer()


            staticDiv.appendChild(p);
            loadDiv.appendChild(staticDiv);
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
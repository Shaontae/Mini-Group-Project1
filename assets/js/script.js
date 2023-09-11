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
    
    // JSON List:
    // stage (number) - stageMaster
    // emojiNum (number) - eNumMaster
    // chosenEmojis (array) - emojisMaster
    // eligibleEmojis (array) - eligibleMaster
    // more to come

    baseCard.innerHTML = '';

    isLoading = false;

    stage = 0;
    // emojiNum = 0;
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
    // localStorage.setItem("eNumMaster", JSON.stringify(emojiNum));
    localStorage.setItem("emojisMaster", JSON.stringify(chosenEmojis));
    localStorage.setItem("eligibleMaster", JSON.stringify(eligibleEmojis));
    localStorage.setItem("keywordsMaster", JSON.stringify(keywordsRaw));
    localStorage.setItem("questionMaster", JSON.stringify(currentQuestion));
    localStorage.setItem("inputMaster", JSON.stringify(userInputRaw));
    localStorage.setItem("moviesMaster", JSON.stringify(movieMatches));
    localStorage.setItem("mkwMaster", JSON.stringify(movieKeywords));
    localStorage.setItem("selectionsMaster", JSON.stringify(mkwSelections));
    localStorage.setItem("winnerMaster", JSON.stringify(winner));


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
    // console.log("Word Soup:")
    // console.log(wordSoup)
    const moviesAdd = await moviePusher();
    dumpProcessor();
    localStorage.setItem("moviesMaster", JSON.stringify(movieMatches));
    console.log(movieMatches)

    async function moviePusher(){
        let moviesPending =[];
        
        // console.log("Title Words:")
        // console.log(titleWords);
        const initPulls = await starterPulls(titleWords);
        // console.log("Initial Promises")
        // console.log(movieProms)
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
                        }
                    }
                    // let rando = Math.ceil(Math.random()*pull.value.total_pages);
                    let rando = Math.ceil(Math.random()*actualValue());
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
        // console.log(movieDump)
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
                // unifiedSplit=movieObj.titleSplit.concat(movieObj.oTitleSplit, movieObj.plotSplit);
                unifiedSplit=movieObj.titleSplit.concat(movieObj.plotSplit);
                movieObj["wordSoup"]=[...new Set(unifiedSplit)]

                // console.log(movieObj);

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
            // console.log("Let's see if I can read this:")
            // console.log(moviePull(titleWordVar, 1))
        })
    };

    async function moviePull (word, page){
        // console.log("Pull Check:")
        // console.log(word)
        // console.log(page)
        let movieUrl = "https://api.themoviedb.org/3/search/movie?api_key=654175309f8dda54d6e0ea0c7706fa04&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&query="+word+"&page="+page+"&without_genres=99";
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

function mkwTabulator(){
    let mkwSluice=[];
    let tabMin = 6;
    let mkwMax = 100;
    movieMatches.forEach((movie)=>{
        // let movieArrays = [movie.titleSplit, movie.oTitleSplit, movie.plotSplit];
        // movieArrays.forEach((array)=>{mkwDump(array)});
        // mkwSluice= mkwSluice.concat(movie.wordSoup);
        mkwSluice= mkwSluice.concat(movie.plotSplit);
    });

    let movieKeywordsFloat=[...new Set(mkwSluice)].map((mkw)=>{
        let mkwObj={
            word: mkw,
            tab: 0,
        };
        movieMatches.forEach((movie)=>{
            // if (movie.wordSoup.includes(mkw)){
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
            // console.log(mkwRandoOP)
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
    // function mkwDump(array){
    //     array.forEach((word)=>{
    //         mkwSluice.push(word);
    //     });
    // };
};

async function scoreTabulator(){
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


    let synsSluice=[];
    let finalists = movieMatches.filter((movie)=>{
        // console.log(movieMatches)
        let isIncluded = false;
        let onlySelectorWords = mkwSelections.map((item)=>{
            return item.word;
        });
        onlySelectorWords.forEach((word)=>{
            // console.log(movie.title)
            // console.log(word)
            // console.log(movie.wordSoup.includes[word])
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
    console.log(finalists)


    let selectedSluice = mkwSelections.map((mkw)=>{
        return mkw.word
    });
    console.log(selectedSluice)
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
    // console.log(primarySluice)
    // keywordsRaw
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
    console.log(winners)
    console.log(winners.length)
    console.log(winners[Math.floor(Math.random()*winners.length)])

    if (winners.length===1){
        winner=winners[0];
    } else {
        winner = winners[Math.floor(Math.random()*winners.length)]
    };

    // winnerProm = [];

    // const addOmdbData= await fetch("https://api.themoviedb.org/3/movie/"+winner.id+"/external_ids?api_key=654175309f8dda54d6e0ea0c7706fa04")
    // .then((response)=>{
    //     if (response.status===200){
    //         return response.json()
    //     } else{
    //         return "error"
    //     }

    // }).then((data)=>{
    //     // fetch("http://www.omdbapi.com/?apikey=1aa15ab1&type=movie&plot=full&i="+data.imdb_id).then((response)=>{
    //     //     if (response.status===200){
    //     //         return response.json()
    //     //     } else{
    //     //         return "error"
    //     //     }
    
    //     // }).then((data)=>{
    //     //     winner["omdbData"]=data;
    //     //     winner["fullPlot"]=data.Plot;
    //     //     winner["year"]=data.Year;
    //     //     winner["director"]=data.Director;
    //     //     winner["cast"]=data.Actors;
    //     //     // console.log(data.Ratings[1].value)
    //     //     // winner["rtRating"]=data.Ratings[1].value;
    //     // });
    //     winnerProm.push(
    //         fetch("http://www.omdbapi.com/?apikey=1aa15ab1&type=movie&plot=full&i="+data.imdb_id)
    //         .then((response)=>{
    //             if (response.status===200){
    //                 return response.json()
    //             } else{
    //                 return "error"
    //             };
    //         }))
        
    // });
    // const waitForWinner = await Promise.allSettled(winnerProm).then((data)=>{
    //     winner["omdbData"]=data;
    //     winner["fullPlot"]=data.Plot;
    //     winner["year"]=data.Year;
    //     winner["director"]=data.Director;
    //     winner["cast"]=data.Actors;
    //         // console.log(data.Ratings[1].value)
    //         // winner["rtRating"]=data.Ratings[1].value;
    // })
    console.log(winner)

    localStorage.setItem("winnerMaster", JSON.stringify(winner));

    // console.log(finalists)
    

    function arrayChecker(movie, movieArray, keywordArray){
        // let points = movieArray[1]+keywordArray[1];
        let points = movieArray[1]*keywordArray[1];
        movieArray[0].forEach((movieStr)=>{
            keywordArray[0].forEach((keyword)=>{
                if (movieStr.includes(keyword)){
                    
                    movie.score+=points;
                    // console.log("Movie: "+movie.title)
                    // console.log("Keyword: "+keyword)
                    // console.log(movieArray[1], keywordArray[1])
                    // console.log("Points: +"+points)
                    // console.log("Score: "+movie.score)
                    // console.log("Sluice")
                    // console.log(keywordArray)
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
        mkwTabulator();
        console.log("MKW: ")
        console.log(movieKeywords);
        isLoading = false;
        stageUpFn();
    };
};

function renderPicker(){
    let storedMatches = JSON.parse(localStorage.getItem("moviesMaster"));
    if (storedMatches!==null){
        console.log(storedMatches)
        movieMatches=storedMatches;
    };
    let storedMkwSelections=JSON.parse(localStorage.getItem("selectionsMaster"));
    if (storedMkwSelections!==null){
        console.log(storedMkwSelections)
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
            // Add Eventlisteners
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

    if (winner.posterCheck!=="N/A"){
        moviePoster.setAttribute("class", "poster");
    } else {
        moviePoster.setAttribute("class", "nv");
    }
   
    noPoster.setAttribute("class", "noPoster");
    noPoster.textContent = "Poster Not Found"
    
    

    // directorLabel.textContent="Directed by:";
    // directorText.textContent = winner.director;
    // castLabel.textContent="Cast:";
    // castText.textContent=winner.cast;

    // if (winner.fullPlot!==undefined&&winner.fullPlot!=="N/A"){
    //     plotText.textContent=winner.fullPlot;
    // } else {
    //     plotText.textContent=winner.altPlot;
    // }
    plotText.textContent=winner.altPlot;
    // if (movie.year!==undefined){
    //     movieTitle.textContent = winner.title+" ("+winner.year+")";
    // } else{
    //     movieTitle.textContent = winner.title+" ("+winner.altYear+")";
    // };

    movieTitle.textContent = winner.title+" ("+winner.altYear+")";
    


    castDiv.appendChild(castLabel);
    castDiv.appendChild(castText);
    
    directorDiv.appendChild(directorLabel);
    directorDiv.appendChild(directorText);

    titleDiv.appendChild(movieTitle);

    detailsCard.appendChild(titleDiv);
    // detailsCard.appendChild(directorDiv);
    // detailsCard.appendChild(castDiv);

    plotDiv.appendChild(plotText);

    sideCard.appendChild(detailsCard);
    sideCard.appendChild(plotDiv);

    if (winner.posterCheck!=="N/A"){
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



// fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=654175309f8dda54d6e0ea0c7706fa04&language=en-US").then((response)=>{
//     if (response.status===200){
//         return response.json()
//     }
// }).then((data)=>{console.log(data)})
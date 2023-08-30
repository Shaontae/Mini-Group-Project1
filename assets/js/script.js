    var startBtn = document.getElementById("startBtn");

    startBtn.addEventListener('click', function() {
        startBtn.style.display = "none";
        
        appendEmojis();
    });

    function appendEmojis(){
        var emojiContainer = document.createElement("div");
        emojiContainer.className = ("emoji-div");
        document.body.appendChild(emojiContainer);
        
        // creates UL to hold the emoji lists
        var emojiList = document.createElement("ul");
        emojiContainer.appendChild(emojiList);

        var count = 1; //empty counter to add class names
        //for loop to create list items and buttons 
        for (i = 0; i < 5; i++) {
        var li = document.createElement('li'); // creates li(s)
        var button = document.createElement('button'); // creates anchors within the list items
            button.className = "emoji" + count;
        emojiList.appendChild(li); //appending to UL
            li.appendChild(button); // appending to the newly created list items
            count++
        }   
    }
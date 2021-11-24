// global variables
var searchHistory = [];  // create an empty object to hold the search history arrays
var inputDisplay = document.querySelector("#typedInWord");
var memeHistory = document.querySelector("#meme-history");
var searchForm = document.querySelector("#user-form");

// generic random number function
var randomNumber = function(min, max) { 
    var value = Math.floor(Math.random() * (max - min + 1) + min);
    return value;
};

// function to get a synonym for the word the user enters from the Thesaurus API
var getWord = function(word) {
    var startWord = "https://words.bighugelabs.com/api/2/9a06618119fb219174cc6aaec15b4f46/" + word +"/json";

    for (let run = 0; run < 3; run++) {
        
    

        fetch(startWord).then(function (response) {
            response.json().then(function(data) {
                if (data.noun) { // If (“noun” in objectName)
                    console.log(data);
                    var num = data.noun.syn.length - 1; // num = the number of possible synonyms a word has
                    var pickRandomSynNum = randomNumber(0,num); // returns a random number representing a random word in the noun.array
                    var wordToMeme = data.noun.syn[pickRandomSynNum]; // sets the word that we will meme to a random synonym.
                    
                    if (!word || !wordToMeme) {
                        alert("Something went wrong!");
                        return;
                    }

                    // I think this function should be outside this function call - first it makes it easier to use in future, second, we might need to include get word in a loop and we don't want it logging every synonym it pulls - just the original search
                    // save the original word and the synonym to local storage
                    
                    // addToMemeHistory(word, wordToMeme); // adds the orignal word + the synonym word to the search history bar
                    getMeme(wordToMeme); // passes the random synonym into a function that will make a call to the giphy API
                    
                    var newWord = isNew(word);
                    console.log(newWord);
                    
                    if (newWord) {
                        addToMemeHistory(word, wordToMeme);
                        var newHistoryToAdd =  {
                            memeWord: word,
                            memeSyn: wordToMeme
                        };
                        searchHistory.push(newHistoryToAdd);
                        localStorage.setItem("history", JSON.stringify(searchHistory));
                    }
                    

                }
            
            });
        });
    };
};

var getMeme = function(wordFromThesaurus) {
    // returning 1 values from the giphy API
    var giphyURL = "https://api.giphy.com/v1/gifs/search?api_key=vcTR1GucFAwcW13jdyTEqRNcYzBbE9E2&q=" + wordFromThesaurus + "&limit=1&offset=0&rating=r&lang=en";

    fetch(giphyURL).then(function (response) {
        response.json().then(function(data) {

            showThatApp(data, wordFromThesaurus); // calls the function that will display info onto the page
        });
    });
}

// MAIN the function that runs to create and dispaly information to page THIS IS THE MAIN FUNCTION FOR END-USER EXPERIENCE
var showThatApp = function(giphyInfo, wordSyn) {
    $("#memeWord").val("");
    // create variables to grab needed information
    var imageURL = giphyInfo.data[0].images.downsized.url;
    var newWord = $("#memeWord").val().trim();

    // create simple message for UX
    // this needs some help from a TA. Without an if it will display once for each loop. With if it doesn't display
    if (inputDisplay === "") {
        var wordDisplayEl = $("<h2></h2>").text("Memifying " + newWord);
        $("#typedInWord").append(wordDisplayEl); 
    }


    // create repeat button but only once
    if (!document.getElementById("repeat-button")) {

        var repeatButtonHolder = document.createElement("span");
        searchForm.append(repeatButtonHolder);
        
        var repeatButtonEl = document.createElement("button");
        repeatButtonEl.textContent = ("Memeify Again");
        repeatButtonEl.setAttribute("value", newWord);
        repeatButtonEl.setAttribute("id", "repeat-button");
        repeatButtonEl.type = "button";
        repeatButtonHolder.append(repeatButtonEl);
        repeatButtonEl.onclick = repeatClick;
    }

    // create individual cards for each individual gif
    var mainGifHolder = document.querySelector("#gif-holder");
    var memeCardContainer = document.createElement("div");
    // each card should have its own ID but I haven't solved how to generate that without a loop on this function yet
    // memeCardContainer.setAttribute("id", "new-meme" + (x+1));
    mainGifHolder.appendChild(memeCardContainer);

    var gifExplainEl = document.createElement("p");
    gifExplainEl.textContent = (wordSyn);
    memeCardContainer.append(gifExplainEl);


    var showGif = document.createElement("img");
    showGif.setAttribute("src", imageURL);
    memeCardContainer.appendChild(showGif);


    // $("#giph").attr("src", imageURL);
    // $("#memeWord").val("");
};

// create repeat button function
var repeatClick = function() {
    console.log(this.value)
};

var addToMemeHistory = function(wordTyped, wordSynonym) {
    var insertMemeHistory = document.createElement("button");
    insertMemeHistory.textContent = wordTyped;
    insertMemeHistory.setAttribute("id", "historyWord");
    insertMemeHistory.type = "button";
    memeHistory.append(insertMemeHistory);
};



var isNew = function(word) {
    var newMeme = true;
    for (i = 0; i < searchHistory.length; i++) {
        if (searchHistory[i].memeWord == word) {
            console.log(word, searchHistory[i].memeWord);
            newMeme = false;
        }
    }
    return newMeme;
}

// functionality stuff to make it look prettier. 
// when you click the text area the placeholder clears,
// if you click off the text area the placeholder reappears
$("#memeWord").on("click", function() {
    $("#memeWord").attr("placeholder", "").val("");
}).on("blur", function() {
    $("#memeWord").attr("placeholder", "Enter a Word")
});


// function that will pass the typed in word into the function making the call to the thesaurus app
$("#memeBtn").on("click", function(event) {
    event.preventDefault();

    // clear former search
    $("#typedInWord").text("");
    $("#gif-holder").empty();
    
    var newWord = $("#memeWord").val().trim();
    getWord(newWord);
});

// event listener for when the clear meme history button is clicked
$("#clearBtn").on("click", function() {
    $("#memeHistory").html("");
    searchHistory = [];
    localStorage.setItem("history", JSON.stringify(searchHistory));
    location.reload();
})


// event listener for when something in the search history is clicked
$("#meme-history").on("click", "#historyWord", function() {
    var memeHistoryTerm = $(this).text();
    $("#gif-holder").empty();
    getWord(memeHistoryTerm);
});


window.onload = function() {
    searchHistory = JSON.parse(localStorage.getItem("history"));
    if (searchHistory) {
        for ( i = 0; i < searchHistory.length; i++) {
            addToMemeHistory(searchHistory[i].memeWord, searchHistory[i].memeSyn);
        }
    }
    else {
        searchHistory = [];
    }
};
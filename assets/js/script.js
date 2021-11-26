// global variables
var searchHistory = [];  // create an empty object to hold the search history arrays
var inputDisplay = document.querySelector("#typedInWord");
var memeHistory = document.querySelector("#meme-history");
var searchForm = document.querySelector("#user-form");
var lastWordTyped;

// generic random number function
var randomNumber = function(min, max) { 
    var value = Math.floor(Math.random() * (max - min + 1) + min);
    return value;
};

// function to get a synonym for the word the user enters from the Thesaurus API
var getWord = function(word) {
    lastWordTyped = word;
    var startWord = "https://words.bighugelabs.com/api/2/9a06618119fb219174cc6aaec15b4f46/" + word +"/json";


    fetch(startWord).then(function (response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                if (data.noun) { // If (“noun” in objectName)
                    // console.log(data);
                    var num = data.noun.syn.length - 1; // num = the number of possible synonyms a word has
                    // we will go through and pick 3 random numbers based off how many synonyms there are for a word
                    // this keeps us from having a repeat of the same word
                    var pickRandomSynNum1 = randomNumber(0,num); // returns a random number representing a random word in the noun.array
                    
                    var pickRandomSynNum2 = randomNumber(0,num);
                    if (num > 0) {
                        while (pickRandomSynNum1 === pickRandomSynNum2) {
                            pickRandomSynNum2 = randomNumber(0,num);
                        }
                    }   else {
                        pickRandomSynNum2 = "";
                    }
                    
                    var pickRandomSynNum3 = randomNumber(0,num);
                    if (num > 1) {
                        while (pickRandomSynNum3 === pickRandomSynNum1 || pickRandomSynNum3 === pickRandomSynNum2) {
                            pickRandomSynNum3 = randomNumber(0,num);
                        }
                    }   else {
                        pickRandomSynNum3 = "";
                    }
                        
                        
                    var wordToMeme1 = data.noun.syn[pickRandomSynNum1]; // sets the word that we will meme to a random synonym.
                    var wordToMeme2 = data.noun.syn[pickRandomSynNum2];
                    var wordToMeme3 = data.noun.syn[pickRandomSynNum3];

                    // addToMemeHistory(word, wordToMeme); // adds the orignal word + the synonym word to the search history bar
                    getMeme(wordToMeme1); // passes the random synonym into a function that will make a call to the giphy API
                    if (wordToMeme2) { getMeme(wordToMeme2); } // will only display if the word has enough synonyms
                    if (wordToMeme3) { getMeme(wordToMeme3); } // will only display if the word has enough synonyms

                    // checking if the word is in the search history already or not.
                    // if the word is not saved, it will then be added to the history
                    var newWord = isNew(word);  // returns true if the word is not in search history, false if it is not in the search history
                    if (newWord) { 
                        // this will save the word and the synonyms it sends to giphy into local storage
                        // and add the word to the search history bar at the bottom of the page
                        addToMemeHistory(word, wordToMeme1);
                        var newHistoryToAdd =  {
                            memeWord: word,
                            memeSyn1: wordToMeme1,
                            memeSyn2: wordToMeme2,
                            memeSyn3: wordToMeme3
                        };
                        searchHistory.push(newHistoryToAdd);
                        localStorage.setItem("history", JSON.stringify(searchHistory));
                    } else { // updates local storage with the new synonyms for the word if it is already in the search history
                        var index;
                        for (i = 0 ; i < searchHistory.length; i++) {
                            if (searchHistory[i].memeWord === word) {
                                index = i;
                            }
                        }

                        searchHistory[index].memeSyn1 = wordToMeme1;
                        searchHistory[index].memeSyn2 = wordToMeme2;
                        searchHistory[index].memeSyn3 = wordToMeme3;
                        localStorage.setItem("history", JSON.stringify(searchHistory));

                    }

                } else {
                    displayModal("Please try another word.");
                    $("#memeWord").val("");
                }
                
            });
        } else {
            displayModal("Error:  Word not found!");
            $("#memeWord").val("");
        }
    })
    .catch(function(error) {
        displayModal("Unable to connect to Big Thesaurus!");
    });
};

var getMeme = function(wordFromThesaurus) {
    // returning 1 values from the giphy API
    var giphyURL = "https://api.giphy.com/v1/gifs/search?api_key=vcTR1GucFAwcW13jdyTEqRNcYzBbE9E2&q=" + wordFromThesaurus + "&limit=1&offset=0&rating=r&lang=en";

    fetch(giphyURL).then(function (response) {
        if (response.ok) { 
            response.json().then(function(data) {
                // console.log(data);
                if (data.data.length > 0) {
                    showThatApp(data, wordFromThesaurus); // calls the function that will display info onto the page
                } else {
                    // displayModal('"No giphy available for the word: " + wordFromThesaurus');
                    displayModalNoGiph(wordFromThesaurus);
                }
            });
        } else {
            displayModal("No giphy available!");
        }
    })
    .catch(function(error) {
        displayModal("Unable to connect to Giphy!");
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
    // if (inputDisplay === "") {
    //     // var wordDisplayEl = $("<h2></h2>").text("Memifying " + lastWordTyped);
    //     // $("#typedInWord").append("<h2>Memeifying</h2>"); 
    // }
    $("#typedInWord").html("");
    $("#typedInWord").append("<h2 class = mt-2>Memifying " + lastWordTyped + "</h2>");

    // create repeat button but only once

   /* if (!document.getElementById("repeat-button")) {

        var repeatButtonHolder = document.createElement("span");
        searchForm.append(repeatButtonHolder);
        
        var repeatButtonEl = document.createElement("button");
        repeatButtonEl.textContent = ("Memeify Again");
        repeatButtonEl.setAttribute("value", newWord);
        repeatButtonEl.setAttribute("id", "repeat-button");
        repeatButtonEl.type = "button";
        repeatButtonHolder.append(repeatButtonEl);
        repeatButtonEl.onclick = repeatClick;


    }*/


    // create individual cards for each individual gif
    var mainGifHolder = document.querySelector("#gif-holder");
    var memeCardContainer = document.createElement("div");
    memeCardContainer.className = "card borderMe has-background-primary-light";
    // each card should have its own ID but I haven't solved how to generate that without a loop on this function yet
    // memeCardContainer.setAttribute("id", "new-meme" + (x+1));
    mainGifHolder.appendChild(memeCardContainer);

    var gifExplainEl = document.createElement("p");
    gifExplainEl.textContent = "Synonym: " + wordSyn;
    gifExplainEl.className = "content has-text-centered has-background-primary-light"
    memeCardContainer.append(gifExplainEl);


    var showGif = document.createElement("img");
    showGif.className = "image setImage";
    showGif.setAttribute("src", imageURL);
    memeCardContainer.appendChild(showGif);


    // $("#giph").attr("src", imageURL);
    // $("#memeWord").val("");
};


/* create repeat button function
var repeatClick = function() {
    console.log(this.value)
};
*/


var addToMemeHistory = function(wordTyped, wordSynonym) {
    var insertMemeHistory = document.createElement("button");
    insertMemeHistory.textContent = wordTyped;
    insertMemeHistory.className = "button mx-2 is-info is-outlined is-rounded is-small has-background-info-light has-text-info-dark";
    insertMemeHistory.setAttribute("id", "historyWord");
    insertMemeHistory.type = "button";
    memeHistory.append(insertMemeHistory);
};



var isNew = function(word) {
    var newMeme = true;
    for (i = 0; i < searchHistory.length; i++) {
        if (searchHistory[i].memeWord == word) {
            newMeme = false;
        }
    }
    return newMeme;
}

// will the display an alert Modal instead of using window alert
var displayModal = function(alert) {
    $("#modal").addClass("is-active");
    $("#alert").text(alert);
}

// specialated Modal alert for when there is not GIPHY for the word found
var displayModalNoGiph = function(thesaurausWord) {
    $("#modal").addClass("is-active");
    $("#alert").text("No giphy available for the word: " + thesaurausWord);
}

$(".modal-background").on("click", function() {
    $("#modal").removeClass("is-active");
});

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
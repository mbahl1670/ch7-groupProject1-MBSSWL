var searchHistory = [];  // create an empty object to hold the search history arrays


// fucntion to get a synonym for the word the user enters from the Thesaurus API
var getWord = function(word) {
    var startWordURL = "https://words.bighugelabs.com/api/2/9a06618119fb219174cc6aaec15b4f46/" + word +"/json";
    var startWord = word;
    fetch(startWordURL).then(function (response) {
        if (response.ok) {
            response.json().then(function(data) {
                if (response.ok && data.noun) { // If (“noun” in objectName and theresponse is ok)
                    var indexNum = data.noun.syn.length - 1; // num = the number of possible synonyms a word has
                    var pickRandomSynNum = randomNumber(0,indexNum); // returns a random number representing a random word in the noun.array
                    var wordToMeme = data.noun.syn[pickRandomSynNum]; // sets the word that we will meme to a random synonym.
                    if (!word || !wordToMeme) { // if something has gone wrong we need to get out of this function
                        console.log(data, "data");
                        console.log(word, "word");
                        console.log(pickRandomSynNum, "random syn number");
                        console.log(wordToMeme, "word to meme");
                        alert("Something went wrong!"); // will need to change this to a modal 
                        return;                    
                    }                      
                    // save the original word and the synonym to local storage, fist need to create the array that will be added and populate it
                    var newHistoryToAdd =  {
                        memeWord: word,
                        memeSyn: wordToMeme
                    };
                    
                    // getMeme(wordToMeme); // passes the random synonym into a function that will make a call to the giphy API
                    var giphyURL = "https://api.giphy.com/v1/gifs/search?api_key=vcTR1GucFAwcW13jdyTEqRNcYzBbE9E2&q=" + wordToMeme + "&limit=1&offset=0&rating=r&lang=en";
                    
                    // putting the 2nd API call inside the first API call, hopefully preventing some errors but being sure the 2nd API call only happens after the first one is successfull
                    fetch(giphyURL).then(function (response) {
                        if (response.ok) {
                            response.json().then(function(data) {
                                if (data.data.length > 0) { // checking to be sure giphy has an image for the word selected
                                    showThatApp(data, wordToMeme, startWord); // calls the function that will display info onto the page
                                    saveSearch(startWord, wordToMeme, newHistoryToAdd); // save the search history to the page and local storage
                                } else {
                                    alert("Giphy could not find an image for the synonym:  " + wordToMeme); // will need to change this to a modal
                                    $("#memeWord").val(""); // clear the input form
                                }
                            });
                        } else {
                            alert("Something went wrong"); // will need to change this to a modal
                            $("#memeWord").val(""); // clear the input form
                        }
                    })
                    .catch(function(error) {
                        alert("Something went wrong"); // will need to change this to a modal
                    });
                } else { // if a word other than a noun is entered, says a noun needs to be entered fo this to work
                    // we are supposed to use modals, and a feature will be to searchfor something other than nouns
                    alert("Please entera noun"); // will need to change to a modal
                    $("#memeWord").val(""); // clear the input form
                } 
            });
        } else { // if the thesaurus doesn't have the word to be searchd (404 error returned)
            alert("Error:  word not found!"); // we will need to change to this to a modal somewhow
            $("#memeWord").val(""); // clear the input form
        }
    })
    .catch(function(error) {
        alert("Something went wrong"); // will need to change to modal
    });
}


// OLD FUNCTION THAT WAS BEING CALLED FOR THE 2ND API CALL.  MOVED THIS INTO THE FIRST FUNCTION TO PREVENT A CALL THIS THIS FUNCTION FROM
// HAPPENIGN BEFORE INFO FROM THE FIST API CALL ARRIVED (before the promise was fullfilled)
// var getMeme = function(wordFromThesaurus) {
//     // returning 1 values from the giphy API
//     var giphyURL = "https://api.giphy.com/v1/gifs/search?api_key=vcTR1GucFAwcW13jdyTEqRNcYzBbE9E2&q=" + wordFromThesaurus + "&limit=1&offset=0&rating=r&lang=en";

//     fetch(giphyURL).then(function (response) {
//         response.json().then(function(data) {
//             console.log(wordFromThesaurus);
//             console.log(data);
//             showThatApp(data, wordFromThesaurus); // calls the function that will display info onto the page
//         });
//     });
// }

var showThatApp = function(giphyInfo, wordSyn, originalWord) {
    var imageURL = giphyInfo.data[0].images.downsized.url;
    // var newWord = $("#memeWord").val().trim();
    $("#typedInWord").text(originalWord);
    $("#typedInWord2").text(originalWord + ":  ");
    $("#synonym").text(wordSyn);
    $("#giph").attr("src", imageURL);
    $("#memeWord").val("");
}

var addToMemeHistory = function(wordTyped, wordSynonym) {
    // appends an unorderd list with 2 list items (the original word typed & the random synonym) to the search history area in the footer
    $("#memeHistory").prepend("<ul><li>Original Word: <span id='originalWord'>" + wordTyped + "</span></li><li>Synonym: " + wordSynonym + "</li></ul>");
}


// Saves the word typed & synonym for that word into local storage and into the search area on the page
var saveSearch = function(startWord, memeWord, historyToAdd) {
    if (searchHistory.length < 4) { // limiting the search history to 4 searches
        searchHistory.push(historyToAdd); // add the new searchHistory array to the object
        localStorage.setItem("history", JSON.stringify(searchHistory)); // save the search history to local storage
        addToMemeHistory(startWord, memeWord); // adds the orignal word + the synonym word to the search history bar
    } else {
        searchHistory.splice(0,1); // removes the first item in the searchHistory object
        searchHistory.push(historyToAdd); // add the new search History to the object
        $("#memeHistory").html(""); // clears the meme History html area
        for ( i = 0; i < searchHistory.length; i++) { // goes through the search History array and adds the new search History to the cleared area
            addToMemeHistory(searchHistory[i].memeWord, searchHistory[i].memeSyn);
        }
        localStorage.setItem("history", JSON.stringify(searchHistory));
    }
}

// functionality stuff to make it look prettier. 
// when you click the text area the placeholder clears,
// if you click off the text area the placeholder reappears
$("#memeWord").on("click", function() {
    $("#memeWord").attr("placeholder", "").val("");
}).on("blur", function() {
    $("#memeWord").attr("placeholder", "Type a noun")
});


// event listner that will pass the typed in word into the function making the call to the thesaurus app
$("#memeBtn").on("click", function(event) {
    event.preventDefault();
    var newWord = $("#memeWord").val().trim();
    if (newWord) {
        getWord(newWord);
    } else {
        alert("Please enter a word.") // will need to change to a modal
    }
})

// event listener for when the clear meme history button is clicked
$("#clearBtn").on("click", function() {
    $("#memeHistory").html("");
    searchHistory = [];
    localStorage.setItem("history", JSON.stringify(searchHistory));
    location.reload();
})

// event listener for when something in the search history is clicked
$("#memeHistory").on("click", "#originalWord", function() {
    var memeHistoryTerm = $(this).text();
    getWord(memeHistoryTerm);
});

// generic random number function
var randomNumber = function(min, max) { 
    var value = Math.floor(Math.random() * (max - min + 1) + min);
    return value;
};

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
}
var searchHistory = [];  // create an empty object to hold the search history arrays


// fucntion to get a synonym for the word the user enters from the Thesaurus API
var getWord = function(word) {
    var startWord = "https://words.bighugelabs.com/api/2/9a06618119fb219174cc6aaec15b4f46/" + word +"/json";

    fetch(startWord).then(function (response) {
        response.json().then(function(data) {
            if (data.noun) { // If (“noun” in objectName)
                console.log(data);
                var num = data.noun.syn.length; // num = the number of possible synonyms a word has
                var pickRandomSynNum = randomNumber(0,num); // returns a random number representing a random word in the noun.array
                var wordToMeme = data.noun.syn[pickRandomSynNum]; // sets the word that we will meme to a random synonym.
                
                if (!word || !wordToMeme) {
                    alert("Something went wrong!");
                    return;
                }

                
                // save the original word and the synonym to local storage
                var newHistoryToAdd =  {
                    memeWord: word,
                    memeSyn: wordToMeme
                };
                searchHistory.push(newHistoryToAdd);
                localStorage.setItem("history", JSON.stringify(searchHistory));

                // addToMemeHistory(word, wordToMeme); // adds the orignal word + the synonym word to the search history bar
                getMeme(wordToMeme); // passes the random synonym into a function that will make a call to the giphy API
            }
           
        });
    });
}

var getMeme = function(wordFromThesaurus) {
    // returning 1 values from the giphy API
    var giphyURL = "https://api.giphy.com/v1/gifs/search?api_key=vcTR1GucFAwcW13jdyTEqRNcYzBbE9E2&q=" + wordFromThesaurus + "&limit=1&offset=0&rating=r&lang=en";

    fetch(giphyURL).then(function (response) {
        response.json().then(function(data) {
            console.log(wordFromThesaurus);
            console.log(data);
            showThatApp(data, wordFromThesaurus); // calls the function that will display info onto the page
        });
    });
}

// the function that runs to create and dispaly information to page THIS IS THE MAIN FUNCTION FOR END-USER EXPERIENCE
var showThatApp = function(giphyInfo, wordSyn) {
    var imageURL = giphyInfo.data[0].images.downsized.url;
    var newWord = $("#memeWord").val().trim();

    // create simple message for UX
    var wordDisplayEl = $("<h2></h2>").text("Memifying " + newWord);
    $("#typedInWord").append(wordDisplayEl);



    // $("#typedInWord2").text(newWord + ":  ");
    // $("#synonym").text(wordSyn);
    $("#giph").attr("src", imageURL);
    $("#memeWord").val("");
}

// I've commented this out as I think it's unneeded. But I kept the code as it may be useful to console log it when error fixing

// var addToMemeHistory = function(wordTyped, wordSynonym) {
//     // appends an unorderd list with 2 list items (the original word typed & the random synonym) to the search history area in the footer
//     $("#memeHistory").append("<ul><li>Original Word: " + wordTyped + "</li><li>Synonym: " + wordSynonym + "</li></ul>");
// }

// functionality stuff to make it look prettier. 
// when you click the text area the placeholder clears,
// if you click off the text area the placeholder reappears
$("#memeWord").on("click", function() {
    $("#memeWord").attr("placeholder", "").val("");
}).on("blur", function() {
    $("#memeWord").attr("placeholder", "Type a noun")
});


// function that will pass the typed in word into the function making the call to the thesaurus app
$("#memeBtn").on("click", function(event) {
    event.preventDefault();
    var newWord = $("#memeWord").val().trim();
    getWord(newWord);
})

// event listener for when the clear meme history button is clicked
$("#clearBtn").on("click", function() {
    $("#memeHistory").html("");
    searchHistory = [];
    localStorage.setItem("history", JSON.stringify(searchHistory));
    location.reload();
})

// generic random number function
var randomNumber = function(min, max) { 
    var value = Math.floor(Math.random() * (max - min + 1) + min);
    return value;
};

// this needs to be added back in to create buttons for history as desired

// window.onload = function() {
//     searchHistory = JSON.parse(localStorage.getItem("history"));
//     if (searchHistory) {
//         for ( i = 0; i < searchHistory.length; i++) {
//             addToMemeHistory(searchHistory[i].memeWord, searchHistory[i].memeSyn);
//         }
//     }
//     else {
//         searchHistory = [];
//     }
// }
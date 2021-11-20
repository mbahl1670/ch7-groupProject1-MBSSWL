// var startWord = "https://words.bighugelabs.com/api/2/9a06618119fb219174cc6aaec15b4f46/love/json";

var getWord = function(word) {
    var startWord = "https://words.bighugelabs.com/api/2/9a06618119fb219174cc6aaec15b4f46/" + word +"/json";

    fetch(startWord).then(function (response) {
        response.json().then(function(data) {
            if (data.noun) { // If (“noun” in objectName)
                console.log(data);
                var num = data.noun.syn.length;
                var pickRandomSynNum = randomNumber(0,num);
                var wordToMeme = data.noun.syn[pickRandomSynNum];

                getMeme(wordToMeme);
            }
           
        });
    });
}

var getMeme = function(wordFromThesaurus) {
    // returning 5 values from the giphy API
    var giphyURL = "https://api.giphy.com/v1/gifs/search?api_key=vcTR1GucFAwcW13jdyTEqRNcYzBbE9E2&q=" + wordFromThesaurus + "&limit=1&offset=0&rating=r&lang=en";

    fetch(giphyURL).then(function (response) {
        response.json().then(function(data) {
            console.log(wordFromThesaurus);
            console.log(data);
            showThatApp(data, wordFromThesaurus);
        });
    });
}

var showThatApp = function(giphyInfo, wordSyn) {
    var imageURL = giphyInfo.data[0].images.downsized.url;
    var newWord = $("#memeWord").val().trim();
    $("#typedInWord").text(newWord);
    $("#typedInWord2").text(newWord + ":  ");
    $("#synonym").text(wordSyn);
    $("#giph").attr("src", imageURL);
    $("#memeWord").val("");
}

// functionality stuff to make it look prettier. 
// when you click the text area the placeholder clears,
// if you click off the text area the placeholder reappears
$("#memeWord").on("click", function() {
    $("#memeWord").attr("placeholder", "").val("");
}).on("blur", function() {
    $("#memeWord").attr("placeholder", "Type a noun")
});

$("#memeBtn").on("click", function(event) {
    event.preventDefault();
    var newWord = $("#memeWord").val().trim();
    getWord(newWord);
    // $("#memeWord").val(""); // clears the text area after we click the button
})

var randomNumber = function(min, max) {
    var value = Math.floor(Math.random() * (max - min + 1) + min);
    return value;
  };
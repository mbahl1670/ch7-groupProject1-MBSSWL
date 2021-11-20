// memeKey = "vcTR1GucFAwcW13jdyTEqRNcYzBbE9E2";

// var startWord = "https://words.bighugelabs.com/api/2/9a06618119fb219174cc6aaec15b4f46/love/json";

var getWord = function(word) {
    var startWord = "https://words.bighugelabs.com/api/2/9a06618119fb219174cc6aaec15b4f46/" + word +"/json";

    fetch(startWord).then(function (response) {
        response.json().then(function(data) {
            console.log(data);
        });
    });
}

$("#memeBtn").on("click", function(event) {
    event.preventDefault();
    var newWord = $("#memeWord").val().trim();
    getWord(newWord);
})


// start giphy stuff below here feel free to move as needed

var getGiph = function(meme) {
    var memeURL = "https://api.giphy.com/v1/gifs/search?api_key=vcTR1GucFAwcW13jdyTEqRNcYzBbE9E2&limit=5&offset=0&rating=pg-13&lang=en&q=" + meme;

    fetch(memeURL).then(function (response) {
        response.json().then(function(data) {
            console.log(data);
        });
    });
};



$("#giphybtn").on("click", function(event) {
    event.preventDefault();
    var newMeme = $("#giphyWord").val().trim();
    getGiph(newMeme);
    console.log(event.data[0].id);
});

// might return something other than a gif. Suggest only returning gifs. 
// type is located at content.data[i].type

// display downsized gif

var downEx = document.createElement("img");
// downEx.src = 
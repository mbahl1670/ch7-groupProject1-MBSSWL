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
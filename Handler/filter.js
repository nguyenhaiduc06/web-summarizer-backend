var fs = require("fs");
var process = require("process");
var args = process.argv;
var extractor = require("./extractor");
var Data = require("../Data");
// module này để gắn các câu có liên quan tới nhau thành 1 (câu sau có các từ nối như because of that)
function getTransitionPhrases() {
    // lấy các từ nối từ data
    // var tLines = fs.readFileSync("Data/transition_phrases.txt").toString();
    // var lines = tLines.split("\n");
    var lines = Data.transition_phrases;
    console.log("🚀 ~ lines", lines)
    result = [];
    for (var line of lines)
        result.push(line.trim());
    return result;
}

function isTransitionPhrase(transitionPhrases, sentence) {
    // xem câu có bắt đầu = từ nối không
    var lower = sentence.toLowerCase();
    for (var phrase of transitionPhrases)
        if (lower.startsWith(phrase))
            return true;
    return false;
}


function omitTransitionSentences(sentences) {
    // ghép
    var transitionPhrases = getTransitionPhrases();
    result = [];
    for (var sentence of sentences){
        if (isTransitionPhrase(transitionPhrases, sentence)){
            var tList = sentence.split(" ");
            tList[0] = tList[0].toLowerCase();
            var tSentence = "";
            for (var word of tList)
                 tSentence += (" " + word);
            var handlingSentence = result[result.length-1];
            handlingSentence = handlingSentence?.substring(0,handlingSentence.length-2);
            handlingSentence+= ("," + tSentence);
        }
        else result.push(sentence);
    }
    return result;
}

module.exports = {
    omitTransitionSentences,
};
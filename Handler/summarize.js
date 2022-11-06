var fs = require("fs");
var extractor = require("./extractor");
var filter = require("./filter");
var scoring = require("./scoring");

// module tổng
function summarize(article, numOfSentences = 2) {
    //tóm tắt
    var allWords = extractor.getWords(article);
    var wordScores = scoring.getWordScore(allWords);
    var allSentences = extractor.getSentences(article);
    allSentences = filter.omitTransitionSentences(allSentences);
    var sentenceScores = scoring.getScoreList(allSentences, wordScores)
    if (numOfSentences > allSentences.length) {
        alert("The summary cannot be longer than the text.");
        return;
    }
    var threshold = scoring.xHighestScore(sentenceScores, numOfSentences);
    var topSentences = scoring.topSentences(allSentences, sentenceScores, threshold)
    var summary = "";
    for (var sentence of topSentences)
        summary += sentence + " ";
    summary = summary.substring(0, summary.length - 1);
    return summary;
}

module.exports = {
    summarize,
};



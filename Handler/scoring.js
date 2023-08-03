var fs = require("fs");
var extractor = require("./extractor");
var Data = require("../Data");

function refineArticle(sentences) {
    //chuyển tất cả các chữ trong article về dạng thường để chấm điểm
    var tSentences = [];
    for (var sentence of sentences) {
        var words = extractor.getWords1(sentence);
        sentence = "";
        for (var word of words)
            sentence += " " + word;
        sentence = sentence.substring(1);
        tSentences.push(sentence);
    }
    return tSentences;
}

function getSentencesSimilarity(sentences) {
    //lấy điểm các câu
    var wordsToIgnore = Data.words_to_ignore;
    var tSentences = refineArticle(sentences);
    var similarityDict = [];
    for (var i = 0; i < tSentences.length; i++) {
        var tArray = [];
        similarityDict.push(tArray);
    }
    for (var i = 0; i < tSentences.length; i++) {
        similarityDict[i].push(1);
        for (var j = i + 1; j < tSentences.length; j++) {
            var tSet = new Set();
            var sentence1 = tSentences[i];
            var sentence2 = tSentences[j];
            var words1 = sentence1.split(" ");
            var words2 = sentence2.split(" ");
            var num1 = words1.length;
            var num2 = words2.length;
            if (num1 >= num2)
                for (var word of words1)
                    if (words2.includes(word))
                        if (!wordsToIgnore.includes(word))
                            tSet.add(word);
            if (num1 < num2)
                for (var word of words2)
                    if (words1.includes(word))
                        if (!wordsToIgnore.includes(word))
                            tSet.add(word);
            var tmp = tSet.size;
            var score = tmp / (Math.log2(num1) + Math.log2(num2));
            similarityDict[i].push(score);
            similarityDict[j].push(score);
        }
    }
    return similarityDict;
}

function getScoreList(sentencesSimilaritiy) {
    //lấy điểm các câu
    var formerList = [];
    var latterList = [];
    for (var i = 0; i < sentencesSimilaritiy.length; i++) {
        latterList.push(1);
    }
    if(sentencesSimilaritiy.length == 1){
        return latterList;
    }
    for (var i = 0; i < 30; i++) {
        formerList = latterList.slice(0);
        latterList = [];
        for (var list of sentencesSimilaritiy) {
            var tmp = 0;
            for(var j=0;j<list.length;j++){
                if (list[j] == 1){
                    continue;
                }
                tmp += (list[j] * formerList[j]);
            }
            var score = 0.15 + (0.85 * tmp / (formerList.length-1));
            latterList.push(score);
        }
    }
    return latterList;
}

function xHighestScore(sentenceScores, x) {
    // Tìm từ có điểm top x
    var list = [];
    for (var score of sentenceScores)
        list.push(score);
    list.sort((a, b) => b - a);
    return list[x - 1];
}

function topSentences(allSentences, sentenceScores, threshold, numOfSentences) {
    // trả danh sách các câu có điểm > threhold
    var result = [];
    for (var i = 0; i < allSentences.length; i++){
        if (sentenceScores[i] >= threshold){
            result.push(allSentences[i]);
            if(result.length == numOfSentences)
                break;
        }
    }
    return result;
}

module.exports = {
    getSentencesSimilarity,
    getScoreList,
    xHighestScore,
    topSentences,
};
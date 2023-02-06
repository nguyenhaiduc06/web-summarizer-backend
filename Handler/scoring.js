var fs = require("fs");
var extractor = require("./extractor");

// module chấm điểm
// function getWordScore(allWords) {
//     // Trả lại HashMap với key là từ và value là số lần xuất hiện của từ tương ứng
//     var dictionary = new Map();
//     var wordsToIgnore = fs.readFileSync("Data/words_to_ignore.txt").toString().split("\n");
//     for (var i = 0; i < allWords.length; i++) {
//         var word = allWords[i];
//         if (wordsToIgnore.includes(word))
//             continue;
//         var count = 1.0;
//         var dictKeys = Array.from(dictionary, ([key, value]) => (key));
//         if (dictKeys.includes(word))
//             count += dictionary.get(word);
//         dictionary.set(word, count);
//     }
//     return dictionary;
// }

// function count(word, sentence) {
//     // Đếm số lần xuất hiện của từ trong câu
//     var tLWords = sentence.split(" ");
//     var count = 0;
//     for (var i = 0; i < tLWords.length; i++)
//         if (word == tLWords[i])
//             count++;
//     return count;
// }

// function score(sentence, wordScores) {
//     // Tính điểm của câu (wordScores là data số điểm)
//     var denominator = 1.0;
//     var score = 0.0;
//     var words = sentence.split(" ");
//     for (var i = 0; i < words.length; i++) {
//         var word = words[i];
//         var wordScoreKeys = Array.from(wordScores, ([key, value]) => (key));
//         if (!(wordScoreKeys.includes(word)))
//             continue;
//         if (count(word, sentence) == 1)
//             denominator += 1.0;
//         word = parser.cleanWord(word);
//         score += wordScores.get(word);
//     }
//     return (score / denominator);
// }

// function getSentenceScoreDict(allSentences, wordScores) {
//     // Trả lại HashMap với key là câu và value là điểm mỗi câu tương ứng 
//     var dictionary = new Map();
//     for (var i = 0; i < allSentences.length; i++) {
//         var sentence = allSentences[i];
//         var temp = score(sentence, wordScores);
//         dictionary.set(sentence, temp);
//     }
//     return dictionary;
// }

// function getScoreList(allSentences, wordScores) {
//     // Trả lại danh sách điểm cùng thứ tự với câu
//     var sScore = [];
//     for (var i = 0; i < allSentences.length; i++) {
//         var sentence = allSentences[i];
//         sScore.push(score(sentence, wordScores));
//     }
//     return sScore;
// }

// function printPopular(dictionary, sortedItems, top = 10) {
//     // In top 10 từ xuất hiện nhiều nhất
//     if (top >= sortedItems.length)
//         top = sortedItems.length - 1;
//     console.log("Rank:", "Score:", "Content:");
//     for (var i = 0; i < top; i++) {
//         word = sortedItems[i];
//         count = dictionary.get(word);
//         console.log("#" + (i + 1) + ".", count, word);
//     }
// }

// function xHighestScore(sentenceScores, x) {
//     // Tìm từ có điểm top x
//     var list = [];
//     for (var score of sentenceScores)
//         list.push(score);
//     list.sort((a, b) => b - a);
//     return list[x - 1];
// }


// function topSentences(allSentences, sentenceScores, threshold) {
//     // trả danh sách các câu có điểm > threhold
//     var result = [];
//     for (var i = 0; i < allSentences.length; i++)
//         if (sentenceScores[i] >= threshold)
//             result.push(allSentences[i]);
//     return result;
// }

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

function getSentencesScores(sentences) {
    //lấy điểm các câu
    var wordsToIgnore = fs.readFileSync("Data/words_to_ignore.txt").toString().split("\n");
    var tSentences = refineArticle(sentences);
    var scoresDict = [];
    for (var i = 0; i < tSentences.length; i++) {
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
            scoresDict.push(score + " " + i + " " + j);
        }
    }
    return scoresDict;
}

function topSentences(allSentences, sentenceScores, x) {
    var list = [];
    for (var score of sentenceScores)
        list.push(score);
    list.sort((a, b) => parseFloat(b.split(" ")[0]) - parseFloat(a.split(" ")[0]));
    var resultNum = new Set();
    var i = 0;
    while (resultNum.size < x) {
        resultNum.add(parseInt(list[i].split(" ")[1]));
        resultNum.add(parseInt(list[i].split(" ")[2]));
        i++;
    }
    var resultArray = Array.from(resultNum).sort((a, b) => a - b);
    if(resultNum.size > x)
        resultArray.pop();
    var result = [];
    for (var num of resultArray)
        result.push(allSentences[num]);
    return result;
}

module.exports = {
    getSentencesScores,
    topSentences,
};
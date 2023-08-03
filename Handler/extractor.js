var fs = require("fs");
var parser = require("./parser");
var filter = require("./filter");

function numOfSentences(sentence) {
    // xử lý dữ liệu nhập vào trả về list các câu
    var sentences = getSentences(sentence);
    sentences = filter.omitTransitionSentences(sentences);
    return sentences.length;
}

function getSentences(sentence) {
    // xử lý dữ liệu nhập vào trả về list các câu
    sentence = parser.removeNumTag(sentence);
    sentence = sentence.replaceAll(/(\r\n|\n|\r|\t)/gm, " ");
    sentence = parser.convertAbbreviations(sentence);
    sentence = sentence.replaceAll("?", ".");
    sentence = sentence.replaceAll("!", ".");
    var sentences = sentence.split(". ");
    sentences[sentences.length-1] = sentences[sentences.length-1].replace(/\.$/, '');
    sentences = parser.fixBrokenSentences(sentences);
    sentences = parser.removeWhiteSpaceList(sentences);
    sentences = parser.removeBlanks(sentences);
    sentences = parser.addPeriods(sentences);
    sentences = parser.cleanupQuotes(sentences);
    sentences = parser.groupQuotes(sentences);
    sentences = parser.commaHandler(sentences);
    return sentences;
}

function getWords(word) {
    // xử lý dữ liệu nhập vào trả về list các từ
    word = word.replaceAll("\n", " ");
    word = parser.convertAbbreviations(word);
    var words = word.split(" ");
    words = parser.removeBlanks(words);
    for (var i = 0; i < words.length; i++)
        words[i] = parser.cleanWord(words[i]);
    return words;
}

function getWords1(sentence) {
    // xử lý dữ liệu nhập vào trả về list các từ
    var tSentence = sentence.replaceAll(".","");
    var words = tSentence.split(" ");
    words = parser.removeBlanks(words);
    for (var i = 0; i < words.length; i++)
        words[i] = parser.cleanWord(words[i]);
    return words;
}

module.exports = {
    getWords,
    getWords1,
    getSentences,
    numOfSentences,
};
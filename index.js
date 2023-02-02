const app = require("express")();
const unfluff = require("unfluff");
const axios = require("axios");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const summary = require("./Handler/summarize")
const localExtractor = require("./Handler/extractor")
var fs = require("fs");

app.use(cors());

app.listen(PORT, () => {
  console.log("listing on port", PORT);
});

app.post("/", (req, res) => {
  res.status(200).send("Hello world 🌏");
});

app.post("/content", async (req, res) => {
  try {
    const num = req.query.params.split(" ")[1];
    const type = req.query.params.split(" ")[0];
    var article;
    if (type == "viaLink") {
      const url = req.query.url;
      const response = await axios.get(url);
      const data = unfluff(response.data, 'en');
      article = data.text;
    }
    if (type == "local") {
      article = req.query.data;
    }
    var numOfSentences = localExtractor.numOfSentences(article);
    if (num == undefined){
      var sumArticle = summary.summarize(article, numOfSentences);
      res.status(200).send(sumArticle);
    } 
    else if (num <= numOfSentences) {
      var sumArticle = summary.summarize(article, num);
      res.status(200).send(sumArticle);
    }
    else {
      res.status(200).send("UNABLE TO SUMMARIZE TO GIVEN NUMBER OF SENTENCES. MINIMUM NUMBER OF SENTENCES CAN BE SUMMARIZED TO IS "+  (numOfSentences) +".")
    }
  }
  catch (e) {
    res.status(400).send(e);
  }
});

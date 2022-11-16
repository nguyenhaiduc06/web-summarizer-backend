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
  // console.log(req.params);
  try {
    const num = req.query.params.split(" ")[1];
    const type = req.query.params.split(" ")[0];
    console.log(type);
    console.log(num);
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
    if (num < localExtractor.numOfSentences(article)) {
      var sumArticle = summary.summarize(article, num);
      res.status(200).send(sumArticle);
    }
    else {
      res.status(200).send("THE INPUT NUMBER CAN'T BE LONGER THAN THE ARTICLE.")
    }
  }
  catch (e) {
    res.status(400).send(e);
  }
});

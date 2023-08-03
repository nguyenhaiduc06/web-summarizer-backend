const app = require("express")();
const unfluff = require('unfluff');
const axios = require("axios");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const summary = require("./Handler/summarize");
const localExtractor = require("./Handler/extractor");

app.use(cors());
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log("listing on port", PORT);
});

app.post("/parsed-from-url", async (req, res) => {
  try {
    const { url } = req.body;
    console.log("🚀 ~ url", url);
    var response = await axios.get(url);
    console.log("🚀 ~ response", response);
    const data = unfluff(response.data);
    console.log("🚀 ~ data", data);
    res.status(200).json(data);
  } catch (e) {
    res.status(404).json(e);  
  }
});

app.post("/summerized", async (req, res) => {
  try {
    const { article, length } = req.body;
    // console.log("🚀 ~ article", article);
    // console.log("🚀 ~ length", length);
    const originalSentencesCount = localExtractor.numOfSentences(article);
    // console.log("🚀 ~ originalSentencesCount", originalSentencesCount);
    if(originalSentencesCount<length){
      var summerizedArticle = "Exceed article's length, article length: " + originalSentencesCount;
    }
    else{
      var summerizedArticle = summary.summarize(
      article,
      length
      );
    }
    // console.log("🚀 ~ summerizedArticle", summerizedArticle);

    res.status(200).json({ summerizedArticle });
  } catch (e) {
    console.log("🚀 ~ e", e)
    res.status(200).json(e);
  }
});

const app = require("express")();
const unfluff = require("unfluff");
const axios = require("axios");
const cors = require("cors");
const PORT = process.env.PORT || 3001;

app.use(cors());

app.listen(PORT, () => {
  console.log("listing on port", PORT);
});

app.get("/", (req, res) => {
  res.status(200).send("Hello world 🌏");
});

app.get("/content", async (req, res) => {
  try {
    const url = req.query.url;
    const response = await axios.get(url);
    const data = unfluff(response.data);
    res.status(200).send(data.text);
  } catch (e) {
    res.status(400).send(e);
  }
});

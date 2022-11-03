const app = require("express")();
const unfluff = require("unfluff");
const axios = require("axios");
const cors = require("cors");
const PORT = 8080;

app.use(cors());

app.listen(PORT, () => {
  console.log("listing on port ", PORT);
});

app.get("/content", async (req, res) => {
  const url = req.query.url;
  const response = await axios.get(url);
  const data = unfluff(response.data);
  res.status(200).send(data.text);
});

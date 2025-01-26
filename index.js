const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRouter = require("./routes/url");
const URL = require("./models/url");

const app = express();
const port = 8002;

connectToMongoDB("mongodb://localhost:27017/url-shortener").then(() => {
  console.log("Connected to MongoDB");
});

app.use(express.json());

app.use("/url", urlRouter);

app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
  
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      { new: true } // Return the updated document
    );
  
    if (!entry) {
      // If entry is null, return a 404 response
      return res.status(404).send("Short URL not found.");
    }
  
    res.redirect(entry.redirectURL); // Proceed with redirection
  
  });
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

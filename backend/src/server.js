import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import path from "path";

const app = express();

app.use(express.static(path.join(__dirname, "/build")));
app.use(bodyParser.json());

const withDB = async (operations) => {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri, {useNewUrlParser: true});

    await client.connect();
    const db = client.db("full-stack");

    // Operations
    operations(db);

    res.status(200).json(articleInfo);
    client.close();

  } catch (error) {
    // res.status(500).json({ message: "Error connecting to db" });
  }
};

app.get("/api/articles/:name", (req, res) => {
  withDB( async db => {

    // async function to use await command
    async function run(){
      const articleInfo = await db.collection("articles").findOne({name: articleName});
      res.status(200).json(articleInfo);
    }

    const articleName = req.params.name;
    run();
  });
});

app.post("/api/articles/:name/upvote", (req, res) => {
  withDB( async db => {

    // async function to use await command
    async function run(){
      const articleInfo = await db.collection("articles").findOne({name: articleName});
      console.log(articleInfo);
      await db.collection("articles").updateOne({name: articleName}, {$set: { upvotes: articleInfo.upvotes + 1 }});
      const updatedInfo = await db.collection("articles").findOne({name: articleName})
      res.status(200).json(updatedInfo);
    };
    
    const articleName = req.params.name;
    run();
  });
});

app.post("/api/articles/:name/add-comment", (req, res) => {
  withDB( async db => {

    // async function to use await command
    async function run(){
      const articleInfo = await db.collection("articles").findOne({name: articleName});
      await db.collection("articles").updateOne({name: articleName},{ $set: { comments: articleInfo.comments.concat(req.body) }})
      const updatedInfo = await db.collection("articles").findOne({name: articleName});
      res.status(200).json(updatedInfo);
    }
    
    // const { username, text } = req.body;
    const articleName = req.params.name;
    run();
  });

  // articlesInfo[articleName].comments.push({ username, text });

  // res.status(200).send(articlesInfo[articleName]);
  //   res.status(200).send(`"${req.body.text}" comment is added by ${req.body.username}.`)
});

app.get("*", (req,res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"))
});

app.listen(8000, () => {
  console.log("Listening port 8000...");
});

const express = require("express"); //Import the express dependency
const app = express(); //Instantiate an express app, the main work horse of this server
const port = 5000; //Save the port number where your server will be listening
const { validateUsername } = require("./routes/ValidateUsername");
//Idiomatic expression in express to route and respond to a client request
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  //get requests to the root ("/") will route here
  res.sendFile("index.html", { root: __dirname }); //server responds by sending the index.html file to the client's browser
  //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile
});

//login authenticate
app.post("/authenticateLogin", async (req, res) => {
  let result = await validateUsername(req.body);
  console.log("routes:/authenticateLogin");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

//app.use("/authenticateLogin", validateUsername);

app.listen(port, () => {
  //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Now listening on port ${port}`);
});

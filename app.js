//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Think about a good title, then write down here what is in your mind, in your heart, or whatever you are up to! ";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

mongoose.connect("mongodb://localhost:27017/postsDB");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const postsSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postsSchema);

let posts = [];



app.get("/", function(req, res) {

  Post.find({}, function(err, foundPosts) {
    if (foundPosts.lenght === 0) {
      Post.insertMany(posts, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved posts to DB");
          res.redirect("/");
        }
      });


    } else {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: foundPosts
      });
    }


  });


});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {

  const newTitle = req.body.postTitle;
  const newContent = req.body.postBody;


  const post = new Post({
    title: newTitle,
    content: newContent
  });

  post.save(function(err){
    if(!err){res.redirect("/")}
  });
});



app.get("/posts/:postId", function(req, res) {


const requestedPostId = req.params.postId;

Post.findById({_id:requestedPostId}, function(err, foundPost) {


  if (!err) {
        res.render("post", {
          title: foundPost.title,
          content: foundPost.content
        });

      } else {
        res.redirect("/");
      }});

  });


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});

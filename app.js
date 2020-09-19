//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true,useUnifiedTopology: true});


const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const navItemsSchema = mongoose.Schema({
  name:String,
  content:String
});

const Navitem = mongoose.model("item",navItemsSchema);

const postSchema = mongoose.Schema({
  title:String,
  content:String
});

const Post = mongoose.model("post",postSchema);


app.get("/",function(req,res){
  Navitem.findOne({name:"Home"},function(err,foundOne){
    if(!foundOne)
    {
      const item = new Navitem({
        name:"Home",
        content:"Lacus avaneesh vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
      });
      item.save();
      // console.log("successfully inserted home for the first time.");
      res.redirect("/")
    }
    else
    Post.find({},function(err,posts){
        res.render("home",{startingContent:foundOne.content ,posts:posts});
    })
  });
})


app.get("/compose",function(req,res){
  res.render("compose");
})

app.post("/compose",function(req,res){

  const post = new Post ({
    title:req.body.postTitle,
    content:req.body.postContent
  });

  post.save(function(err){
    if(!err)
    {
     res.redirect("/");
    }
  });
})

app.get('/favicon.ico', (req, res) => res.status(204));

app.get("/:navItemName",function(req,res){
  const navItemName = _.capitalize(req.params.navItemName);
  // console.log(navItemName);
  if(navItemName !==  "Compose")
  {
    Navitem.findOne({name:navItemName},function(err,foundOne){
      if(!foundOne)
      {

        const item1 = new Navitem({
          name:"About",
          content:"Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
        });

        const item2 = new Navitem({
          name:"Contact",
          content:"Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."
        });

        const items = [item1,item2];

        Navitem.insertMany(items,function(err,item){
          if(!err)
          console.log("successfully inserted nav items for the first time");
        })

        res.redirect("/"+navItemName);

      }
      else
      {
        res.render("navItem",{navItemName:navItemName, startingContent:foundOne.content});
      }
    })
  }
})


app.get("/posts/:titleName",function(req,res){
  titleName = req.params.titleName;
  // console.log(titleName);
  Post.findOne({_id:titleName},function(err,foundOne){
    if(!foundOne)
    {
      res.send("uhh oh!! page NOT found.");
    }
    else
    {
      res.render("post",{postTitle:foundOne.title, postContent:foundOne.content});
    }
  });
});





app.listen(3000, function() {
  console.log("Server started on port 3000");
});

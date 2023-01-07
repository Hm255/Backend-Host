const express = require("express");
const cors = require("cors");
const endpoints = require('./endpoints.json')
const { getCategories, getReviewID, getUsers, newRev, getReviews, getCommentByReviewId, newCommentByReviewID, DeleteComment, getComments, getOneComment, getAll} = require("./controller/controller");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/categories", getCategories);  //endpoint invoked with required in getCategories originally from the controller

app.get("/api/reviews/:review_id", getReviewID);
app.get("/api/reviews/:review_id", (commentCount)=>{
  return commentCount;
});

app.get("/api/reviews", getReviews)

app.patch("/api/reviews/:review_id", newRev);

app.get("/api/reviews/:review_id/comments", getCommentByReviewId)
app.post("/api/reviews/:review_id/comments", newCommentByReviewID)

app.get("/api/comments", getComments);

app.get("/api/comments/:comment_id", getOneComment) 

//gets a comment_id and the comment relating to it

app.delete("/api/comments/:comment_id", DeleteComment) 
//gets a comment_id and deletes the comment relating to it

app.get("/api/users", getUsers);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Item does not exist' });
});

app.use((err, req, res, next) => {
  if(err.code === '22P02'){
  res.status(400).send({ msg: "invalid type (type is wrong)" });
  }
  else if(err.code === '22003'){
    res.status(404).send({msg: "Item does not exist"});
  }
  else if (err.code === '23502'){
    res.status(404).send({msg: "Item does not exist"});
  }
  else if(err.code === ''){
    res.status(204).send({msg: "No content"});
  }
  else{
    next()
  }
})

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "something went wrong" });

});

module.exports = app
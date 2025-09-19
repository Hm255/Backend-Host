const express = require("express");
const cors = require("cors");
const endpoints = require("./endpoints.json");

const {
  getCategories,
  getReviewID,
  getUsers,
  newRev,
  getReviews,
  getCommentByReviewId,
  newCommentByReviewID,
  DeleteComment,
  getComments,
  getOneComment,
  commentVote
} = require("./controller/controller");

const app = express();

// --- Global middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewID);
app.get("/api/reviews", getReviews);
app.patch("/api/reviews/:review_id", newRev);

app.get("/api/reviews/:review_id/comments", getCommentByReviewId);
app.post("/api/reviews/:review_id/comments", newCommentByReviewID);

app.get("/api/comments", getComments);
app.get("/api/comments/:comment_id", getOneComment);
app.patch("/api/comments/:comment_id", commentVote);
app.delete("/api/comments/:comment_id", DeleteComment);

app.get("/api/users", getUsers);

// --- 404 handler (must be after all routes) ---
app.use((req, res) => {
  res.status(404).send({ msg: "Item does not exist" });
});

// --- Error-handling middleware ---
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "invalid type (type is wrong)" });
  }
  if (err.code === "22003") {
    return res.status(404).send({ msg: "item is not posted" });
  }
  if (err.code === "23502") {
    return res.status(404).send({
      msg: "Item does not exist, (primary key column may have a null value)"
    });
  }
  if (err.code === "") {
    return res.status(204).end();
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ msg: "something went wrong" });
});

module.exports = app;

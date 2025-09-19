// model/model.js
const db = require("../db/connection");

// Fetch all categories
exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`)
    .then(({ rows }) => rows);
};

// Fetch a single review by ID with comment count
exports.fetchReviewID = (review_id) => {
  return db.query(
    `SELECT reviews.*, COUNT(comments.body)::INT AS comment_count
     FROM reviews
     LEFT JOIN comments ON reviews.review_id = comments.review_id
     WHERE reviews.review_id = $1
     GROUP BY reviews.review_id`,
    [review_id]
  ).then(({ rows }) => rows[0]);
};

// Fetch all users
exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`)
    .then(({ rows }) => rows);
};

// Update review votes
exports.editReview = (inc_votes, review_id) => {
  return db.query(
    `UPDATE reviews
     SET votes = votes + $1
     WHERE review_id = $2
     RETURNING *`,
    [inc_votes, review_id]
  ).then(({ rows }) => rows[0]);
};

// Update comment votes
exports.commentVoter = (inc_votes, comment_id) => {
  return db.query(
    `UPDATE comments
     SET votes = votes + $1
     WHERE comment_id = $2
     RETURNING *`,
    [inc_votes, comment_id]
  ).then(({ rows }) => rows[0]);
};

// Fetch reviews with optional sorting/filtering
exports.fetchReviews = (sortedBy = "created_at", orderedBy = "desc", category) => {
  let queryStr = `
    SELECT reviews.*, COUNT(comments.comment_id)::INT AS comment_count
    FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id
  `;
  const queryParams = [];

  if (category) {
    queryParams.push(category);
    queryStr += ` WHERE reviews.category = $1`;
  }

  queryStr += ` GROUP BY reviews.review_id ORDER BY ${sortedBy} ${orderedBy}`;

  return db.query(queryStr, queryParams)
    .then(({ rows }) => rows);
};

// Fetch all comments
exports.fetchAllComments = () => {
  return db.query(`SELECT * FROM comments`)
    .then(({ rows }) => rows);
};

// Fetch comments for a specific review
exports.fetchCommentbyReviewID = (review_id) => {
  return db.query(
    `SELECT * FROM comments WHERE review_id = $1`,
    [review_id]
  ).then(({ rows }) => rows);
};

// Check if comments exist for a review
exports.checkCommentExists = async (review_id) => {
  const { rows } = await db.query(
    `SELECT * FROM comments WHERE review_id = $1`,
    [review_id]
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Comments not found" });
  }
};

// Post a new comment for a review
exports.postCommentByReviewID = (comment, review_id) => {
  return db.query(
    `INSERT INTO comments (author, body, review_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [comment.username, comment.body, review_id]
  ).then(({ rows }) => rows);
};

// Delete a comment by ID
exports.removeComment = (comment_id) => {
  return db.query(
    `DELETE FROM comments WHERE comment_id = $1`,
    [comment_id]
  ).then(({ rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Comment not found" });
    }
  });
};

// Fetch a single comment by ID
exports.OneComment = (comment_id) => {
  return db.query(
    `SELECT * FROM comments WHERE comment_id = $1`,
    [comment_id]
  );
};

// Optional: fetch all endpoints (if you have a table for them)
exports.fetchAll = () => {
  return db.query(`SELECT * FROM endpoints`)
    .then(({ rows }) => rows);
};

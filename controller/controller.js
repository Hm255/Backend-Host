const {
  fetchCategories,
  fetchReviewID,
  fetchUsers,
  editReview,
  fetchReviews,
  fetchCommentbyReviewID,
  postCommentByReviewID,
  removeComment,
  fetchAllComments,
  OneComment,
  fetchAll,
  checkCommentExists,
  commentVoter
} = require('../model/model');

// GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await fetchCategories();
    res.status(200).send({ categories });
  } catch (err) {
    next(err);
  }
};

// GET /api/reviews/:review_id
exports.getReviewID = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const review = await fetchReviewID(review_id);
    if (!review) return res.status(404).send({ msg: "Review not found" });
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};

// POST /api/reviews/:review_id/comments
exports.newCommentByReviewID = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const comment = req.body;
    const review = await postCommentByReviewID(comment, review_id);
    res.status(201).send({ review: review[0] });
  } catch (err) {
    next(err);
  }
};

// GET /api/users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/reviews/:review_id
exports.newRev = async (req, res, next) => {
  try {
    const { inc_votes } = req.body;
    const { review_id } = req.params;
    const review = await editReview(inc_votes, review_id);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/comments/:comment_id
exports.commentVote = async (req, res, next) => {
  try {
    const { inc_votes } = req.body;
    const { comment_id } = req.params;
    const comment = await commentVoter(inc_votes, comment_id);
    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};

// GET /api/reviews
exports.getReviews = async (req, res, next) => {
  try {
    const { sortedBy, orderedBy, category } = req.query;
    const reviews = await fetchReviews(sortedBy, orderedBy, category);
    res.status(200).send({ reviews });
  } catch (err) {
    next(err);
  }
};

// GET /api/reviews/:review_id/comments
exports.getCommentByReviewId = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const comment = await fetchCommentbyReviewID(review_id);
    if (!comment || comment.length === 0) {
      return res.status(404).send({ msg: "Comments not found" });
    }
    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/comments/:comment_id
exports.DeleteComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    await removeComment(comment_id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// GET /api/comments
exports.getComments = async (req, res, next) => {
  try {
    const comments = await fetchAllComments();
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

// GET /api/comments/:comment_id
exports.getOneComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const comment = await OneComment(comment_id);
    res.status(200).send(comment.rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/all (if fetchAll exists)
exports.getAll = async (req, res, next) => {
  try {
    const endpoints = await fetchAll();
    res.status(200).send(endpoints);
  } catch (err) {
    next(err);
  }
};

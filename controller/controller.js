const express = require('express');

const {fetchCategories, fetchReviewID, fetchUsers, editReview, fetchReviews, fetchCommentbyReviewID, postCommentByReviewID, removeComment, fetchAllComments, OneComment, fetchAll, checkCommentExists, commentVoter} = require('../model/model')
//handling sql queries and directing them to an output in the controller

const app = express();

exports.getCategories = (req, res) => {
    fetchCategories().then((categories) => {
      res.status(200).send({categories});
    });
  };

exports.getReviewID = (req, res, next) => {
  const { review_id } = req.params
  return fetchReviewID(review_id)
  .then((review) => {
    if(review === undefined){
      return res.status(404).send({review})
    }
  return res.status(200).send({review})
  
  })
  .catch((err)=>{
    console.log(err)
    next(err);
  })
};

exports.newCommentByReviewID = (req, res, next) => {
  const { review_id } = req.params
  const comment = req.body 
  
   postCommentByReviewID(comment, review_id)
  .then((review) => {
  return res.status(201).send({review: review[0]})
  })
  .catch((err)=>{
    console.log(err)
    next(err);
  })
};

exports.getUsers = (req, res) => {      
  fetchUsers().then((users) => {
    res.status(200).send({users});
  });
};

exports.newRev = (req, res, next) => {
  const {inc_votes} = req.body
  const {review_id} = req.params
  editReview(inc_votes, review_id)
  .then((review) => {
  res.status(200).send({review});
  })
  .catch((err)=>{
    next(err);
  })
};

exports.commentVote = (req, res, next) => {
  const {inc_votes} = req.body
  const {comment_id} = req.params
  commentVoter(inc_votes, comment_id)
  .then((comment) => {
  res.status(200).send({comment});
  })
  .catch((err)=>{
    next(err);
  })
};

exports.getReviews = (req, res, next) => {
  const {sortedBy, orderedBy, category} = req.query
  return fetchReviews(sortedBy, orderedBy, category)
  .then((reviews) => {
    return res.status(200).send({reviews});
  })
  .catch((err) => {
    next(err)
  });
}

exports.getCommentByReviewId = (req, res, next) => {
  const {review_id} = req.params
  return fetchCommentbyReviewID(review_id)
  .then((comment) => {
    if(comment !== null){
    return res.status(200).send({comment});
    }
  })
  .catch((err) => {
    next(err)
  });
} 

exports.DeleteComment = (req, res, next) => {
  const {comment_id} = req.params
    removeComment(comment_id)
  .then(() => {
    res.status(204).send("Item does not exist")
  })
  .catch((err)=>{
    next(err)
  });
}
 
exports.getComments = (req, res, next) => {
  fetchAllComments()
  .then((comments) => {
    res.status(200).send({comments});
  })
  .catch((err)=>{
    next(err);
  })
}
exports.getOneComment = (req, res, next) => {
  const {comment_id} = req.params
  OneComment(comment_id)
  .then((comment) => {
    res.status(200).send(comment.rows)
  })
  .catch((err)=>{
    next(err)
  });
  };

exports.getAll = (req, res) => {
fetchAll()
.then((endpoints) => {
  res.status(200).send(endpoints)
})
.catch((err)=>{
  next(err)
  console.log(err)
})
}
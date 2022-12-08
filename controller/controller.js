
const express = require('express');
const { restart } = require('nodemon');
const { sort } = require('../db/data/test-data/categories');

const {fetchCategories, fetchReviewID, fetchUsers, editReview, fetchReviews, fetchCommentbyReviewID, postCommentByReviewID, removeComment, fetchAllComments, retrieveComment} = require('../model/model')
//handling sql queries and directing them to an output in the controller

const app = express();

exports.getCategories = (req, res) => {      //takes category data defined in the model and sends it through
    fetchCategories().then((categories) => {
      res.status(200).send({categories});
    });
  };


exports.getReviewID = (req, res, next) => {
  const { review_id } = req.params
  return fetchReviewID(review_id)
  .then((review) => {
  return res.status(200).send({review})
  })
  .catch((err)=>{
    
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

exports.getReviews = (req, res, next) => {
  const {sortedBy, orderedBy, category} = req.query
  return fetchReviews(sortedBy, orderedBy, category)
  .then((reviews) => {
    return res.status(200).send({reviews});
  })
  .catch(next);
}

exports.getCommentByReviewId = (req, res, next) => {
  const {review_id} = req.params
  
  return fetchCommentbyReviewID(review_id)
  .then((comment) => {
    return res.status(200).send({comment});
  })
  .catch(next);
} 
exports.DeleteComment = (req, res, next) => {
  console.log(req)
  const {comment_id} = req.params
  removeComment(comment_id)
  .then((comment) => {
    res.status(204).delete({comment})
  })
  .catch(next);
}
exports.getComments = (req, res) => {
  fetchAllComments()
  .then((comments) => {
    res.status(200).send({comments});
  })
}

exports.getOneComment = (req, res) => {
  const {comment_id} = req.params
  OneComment(comment_id)
  .then((comment) => {
    res.status(200).send({comment})
  })
}
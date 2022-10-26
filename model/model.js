
const app = require("../app");
const db = require("../db/connection");

exports.fetchCategories = () => {
    return db.query(`SELECT * FROM categories`)//sql
    .then(({ rows }) => {                      //sql return handler
        return rows;
    })
}

exports.fetchReviewID = (review_id) => {
    
    return db.query(`SELECT reviews.*, COUNT(comments.body) ::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id`, [review_id])
    .then(({rows})=>{
        
    return rows[0];  
    })
}

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users`)//sql
    .then(({ rows }) => {                      //sql return handler
        return rows;
    })
}


exports.editReview = (inc_votes, review_id) => {
    return db.query(`UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *`, [inc_votes, review_id])
    .then(({rows})=>{
        return rows[0];
    })  
}

exports.fetchReview = (review, category) => { //start of ticket 8
    return db.query(`SELECT reviews.*,  owner ::VARCHAR2 AS owner FROM reviews LEFT JOIN users ON reviews.owner = users.username`)
    .then(({rows})=> {
        return rows;
    })
}

exports.fetchComments = (review_id) => {
    return db.query(`SELECT reviews.*, reviews.body ::VARCHAR2 AS comments FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.created_at`, [review_id])
    .then(({rows})=>{
        
    return rows;  
    })
}

exports.fetchReviews = () => {
    return db.query(`SELECT reviews.*, COUNT(comments.comment_id) ::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id 
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC`)
    .then(({rows}) => {

        return rows;
    })
}

exports.fetchCommentbyReviewID = (review_id) => {
    return db.query(`SELECT comments.* FROM comments WHERE comments.review_id=$1`, [review_id])
    .then(({rows})=> {
        return rows;
    })
}

exports.postCommentByReviewID = (review_id) => {
    return db.query(`INSERT into comments.* WHERE comments.review_id=$1`, [review_id])
}


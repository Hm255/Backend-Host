
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

exports.fetchReviews = (sortedBy = "created_at", orderedBy = "desc", category) => {
    let queryStr = `SELECT reviews.*, COUNT(comments.comment_id) ::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`

    if(category){
        queryStr += ` WHERE reviews.category = $1 
        GROUP BY reviews.review_id 
        ORDER BY ${sortedBy} ${orderedBy}`;
        
        return db.query(queryStr, [category])
        .then(({rows}) => {
            return rows;
        }).catch((err) => {
            console.log(err)
        })
    }
    else{
        return db.query(`SELECT reviews.*, COUNT(comments.comment_id) ::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id 
        GROUP BY reviews.review_id
        ORDER BY ${sortedBy} ${orderedBy}`)// << will be sorted BY sortedBy(given review property) and orderedBy asc/desc
        .then(({rows}) => {
            return rows;
        })
    }
}

exports.fetchAllComments = () => {
    return db.query(`SELECT * FROM comments`)
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

exports.postCommentByReviewID = (comment, review_id) => {
    return db.query(`INSERT into comments (author, body, review_id) VALUES ($1, $2, $3) WHERE review_id=$2 RETURNING *`, [comment.username, comment.body, review_id])
    .then(({rows})=> {
        
        return rows;
    })
}

exports.removeComment = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comments.comment_id=$1`, [comment_id])
}

exports.OneComment = (comment_id) => {
    return db.query(`SELECT comments.* FROM comments WHERE comments.comment_id=$1`, [comment_id]) //should return 1 comment
}

exports.fetchAll = () => {
    
}
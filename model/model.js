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

exports.commentVoter = (inc_votes, comment_id) => {
    return db.query(`UPDATE comments SET votes = votes + $1 WHERE comments.comment_id = $2 RETURNING *`, [inc_votes, comment_id])
    .then(({rows})=>{
        console.log(rows)
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
        else if(!sortedBy || !orderedBy){
            return Promise.reject({ status: 400, message: "missing queries" });
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

exports.checkCommentExists = async (review_id) => {
    const dbOutput = await db.query(
      'SELECT comments.* FROM comments WHERE comments.review_id = $1;',
      [review_id]
    );
    if (dbOutput.rows.length === 0) {
      // resource does NOT exist
      return Promise.reject({ status: 404, msg: 'Comments not found' });
    }
  };

exports.postCommentByReviewID = (comment, review_id) => {
    return db.query(`INSERT into comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *`, [comment.username, comment.body, review_id])
    .then(({rows})=> {
        return rows;
    })
}

exports.removeComment = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comments.comment_id=$1`, [comment_id]).then(({rowCount})=>{
        if(rowCount === 0) {
            return Promise.reject({ status: 204, message: "comment deleted" });
        }
    })
}

exports.OneComment = (comment_id) => {
    return db.query(`SELECT comments.* FROM comments WHERE comments.comment_id=$1`, [comment_id]) //should return 1 comment
}

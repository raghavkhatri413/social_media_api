import pool from "../db.js";

export async function createComment(comment_text,user_id,post_id){
    const res=await pool.query('insert into comments (comment_text,user_id,post_id) values ($1,$2,$3) returning *',[comment_text,user_id,post_id]);
    return res.rows[0];
}

export async function getCommentByID(comment_id){
    const res=await pool.query('select * from comments where comment_id=$1',[comment_id]);
    return res.rows[0];
}

export async function getCommentsByPostID(post_id){
    const res=await pool.query('select * from comments where post_id=$1',[post_id]);
    return res.rows;
}

export async function updateComment(comment_text,comment_id){
    const res=await pool.query('update comments set comment_text=$1 where comment_id=$2 returning *',[comment_text,comment_id]);
    return res.rows[0];
}

export async function deleteComment(comment_id){
    await pool.query('delete from comments where comment_id=$1',[comment_id]);
}
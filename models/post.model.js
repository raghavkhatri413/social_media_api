import pool from "../db.js";

export async function createPost(post,caption,user_id){
    const res=await pool.query('insert into posts (post,caption,user_id) values ($1,$2,$3) returning *',[post,caption,user_id]);
    return res.rows[0];
}

export async function getPostByID(id){
    const res=await pool.query('select * from posts where post_id=$1',[id]);
    return res.rows[0];
}

export async function getAllPostsByUserID(user_id){
    const res=await pool.query('select * from posts where user_id=$1',[user_id]);
    return res.rows;
}

export async function updatePost(id,post,caption){
    const res=await pool.query('update posts set post=$1,caption=$2 where post_id=$3 returning *',[post,caption,id]);
    return res.rows[0];
}

export async function deletePost(id){
    await pool.query('delete from posts where post_id=$1',[id]);
}
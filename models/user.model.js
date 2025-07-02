import pool from "../db.js";

export async function createUser(email,password,username,userRole){
    const res=await pool.query('insert into users (email,password,username,role) values ($1,$2,$3,$4) returning *',[email,password,username,userRole]);
    return res.rows[0];
}

export async function getUserByEmail(email){
    const res=await pool.query('select * from users where email=$1',[email]);
    return res.rows[0];
}

export async function getUserByUserID(user_id){
    const res=await pool.query('select * from users where user_id=$1',[user_id]);
    return res.rows[0];
}

export async function getUserByUsername(username){
    const res=await pool.query('select * from users where username=$1',[username]);
    return res.rows[0];
}

export async function deleteUser(id){
    await pool.query('delete from users where id=$1',[id]);
}
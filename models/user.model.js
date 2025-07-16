import pool from "../db.js";

export async function createUser(email, password, username, userRoleId) {
    const res = await pool.query('insert into users (email,password,username,role_id) values ($1,$2,$3,$4) returning *', [email, password, username, userRoleId]);
    return res.rows[0];
}

export async function getUserByEmail(email) {
    const res = await pool.query('select * from users where email=$1', [email]);
    return res.rows[0];
}

export async function getAllUsersInfo() {
    const res = await pool.query('select username,email from users');
    return res.rows;
}

export async function getUserByUserID(user_id) {
    const res = await pool.query('select * from users where user_id=$1', [user_id]);
    return res.rows[0];
}

export async function getUserInfo(user_id) {
    const res = await pool.query(`
        SELECT 
            users.username,
            users.role_id,
            users.user_id,
            roles.role_name
        FROM 
            users
        JOIN 
            roles ON users.role_id = roles.role_id
        WHERE 
            users.user_id = $1
    `, [user_id]);

    return res.rows[0];
}


export async function getUserByUsername(username) {
    const res = await pool.query('select * from users where username=$1', [username]);
    return res.rows[0];
}

export async function deleteUser(id) {
    await pool.query('delete from users where id=$1', [id]);
}

export async function updateUserRole(id, role_id) {
    console.log("first");
    const res = await pool.query('update users set role_id=$1 where user_id=$2 returning *', [role_id, id]);
    return res.rows[0];
}
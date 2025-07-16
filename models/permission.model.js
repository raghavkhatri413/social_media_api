import pool from "../db.js";

export async function addPermission(permission_id, role_id) {
    const res = await pool.query('insert into role_permissions (permission_id,role_id) values ($1,$2)',[permission_id,role_id]);
    return res.rows[0];
}

export async function removePermission(permission_id, role_id) {
    await pool.query('delete from role_permissions where permission_id=$1 and role_id=$2',[permission_id,role_id]);
}

export async function getPermissionByID(permission_id) {
    const res = await pool.query('select * from permissions where permission_id=$1',[permission_id]);
    return res.rows[0];
}

export async function getAllPermissions() {
    const res = await pool.query('select * from permissions');
    return res.rows;
}

export async function getAllPermissionsFromRoleID(role_id) {
    const res = await pool.query('select (permission_id) from role_permissions where role_id=$1',[role_id]);
    return res.rows;
}
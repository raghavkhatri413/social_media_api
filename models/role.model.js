import pool from "../db.js";

export async function getRole(role_id) {
  const res = await pool.query('select * from roles where role_id=$1', [role_id]);
  return res.rows[0];
}

export async function getRoleID(role) {
  const res = await pool.query('select * from roles where role_name=$1', [role]);
  return res.rows[0];
}

export async function getRolePermission(permission_id, role_id) {
  const res = await pool.query('select * from role_permissions where role_id=$1 and permission_id=$2', [role_id, permission_id]);
  return res.rows[0];
}

export async function getAllRoles(){
    const res=await pool.query('select * from roles');
    return res.rows;
}

export async function getPermissionsByRoleId(roleId) {
  const res = await pool.query(`
    SELECT p.permissions
    FROM permissions p
    JOIN role_permissions rp ON p.permission_id = rp.permission_id
    WHERE rp.role_id = $1
  `, [roleId]);
  return res.rows.map(row => row.permissions);
}
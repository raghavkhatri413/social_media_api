import { getUserInfo } from "../models/user.model.js";
import { getPermissionsByRoleId } from "../models/role.model.js";
import { getPostByID } from "../models/post.model.js";

export default function checkPostPermission(action, resource) {
    return async (req, res, next) => {
        try {
            const userId = req.user?.user_id;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const user = await getUserInfo(userId);
            if (!user) return res.status(404).json({ error: "User not found" });

            const permissions = await getPermissionsByRoleId(user.role_id);

            const resourceId = req.params.post_id || req.params.id;
            let ownsResource = false;

            if (action === "create") {
                const create_permission = `${action}:${resource}`;
                if (permissions.includes(create_permission)) {
                    return next();
                } else {
                    return res.status(403).json({
                        error: `Forbidden: missing permission '${create_permission}'`,
                    });
                }
            }

            if (action !== "create" && resourceId) {
                const post = await getPostByID(resourceId);
                if (!post) return res.status(404).json({ error: "Post not found" });

                ownsResource = post.user_id === userId;
                console.log(post.user_id);

                const postOwner = await getUserInfo(post.user_id);
                if (!postOwner) return res.status(404).json({ error: "Post owner not found" });

                console.log(`Post owner role: ${postOwner.role_name}`);
                console.log(`Requesting user role: ${user.role_name}`);

                const isPostOwnerAdmin = postOwner.role_name?.toLowerCase() === "admin";
                const isRequesterAdmin = user.role_name?.toLowerCase() === "admin";

                // 🚫 Non-admins cannot modify admin's posts (regardless of permissions)
                if (isPostOwnerAdmin && !isRequesterAdmin) {
                    console.log("Blocked: Non-admin trying to modify admin's post.");
                    return res.status(403).json({
                        error: "Forbidden: You cannot modify or delete posts created by admins.",
                    });
                }
            }

            const permissionToCheck = ownsResource
                ? `${action}:own:${resource}`
                : `${action}:any:${resource}`;

            if (!permissions.includes(permissionToCheck)) {
                return res.status(403).json({
                    error: `Forbidden: missing permission '${permissionToCheck}'`,
                });
            }

            return next();
        } catch (err) {
            console.error("Permission check error:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    };
}

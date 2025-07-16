import { getUserInfo } from "../models/user.model.js";
import { getPermissionsByRoleId } from "../models/role.model.js";
import { getCommentByID } from "../models/comment.model.js";

export default function checkCommentPermission(action, resource) {
    return async (req, res, next) => {
        try {
            const userId = req.user?.user_id;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const user = await getUserInfo(userId);
            if (!user) return res.status(404).json({ error: "User not found" });

            const permissions = await getPermissionsByRoleId(user.role_id);

            const resourceId = req.params.comment_id || req.params.id;
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
                const comment = await getCommentByID(resourceId);
                if (!comment) return res.status(404).json({ error: "Comment not found" });

                ownsResource = comment.user_id === userId;

                // 🚨 Fetch comment owner's role
                const commentOwner = await getUserInfo(comment.user_id);
                if (!commentOwner) return res.status(404).json({ error: "Comment owner not found" });

                console.log(`Comment owner role: ${commentOwner.role_name}`);
                console.log(`Requesting user role: ${user.role_name}`);

                const isCommentOwnerAdmin = commentOwner.role_name?.toLowerCase() === "admin";
                const isRequesterAdmin = user.role_name?.toLowerCase() === "admin";

                // 🚫 Non-admins cannot modify/delete admin's comments
                if (isCommentOwnerAdmin && !isRequesterAdmin) {
                    console.log("Blocked: Non-admin trying to modify admin's comment.");
                    return res.status(403).json({
                        error: "Forbidden: You cannot modify or delete comments made by admins.",
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

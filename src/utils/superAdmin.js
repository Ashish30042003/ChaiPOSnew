// Super Admin Configuration
// Add authorized super admin emails here
const SUPER_ADMIN_EMAILS = [
    'ashishbirajdar69680@gmail.com',
    // Add more super admin emails as needed
];

/**
 * Check if a user is a super admin
 * @param {Object} user - Firebase user object
 * @returns {boolean} - True if user is super admin
 */
export const isSuperAdmin = (user) => {
    if (!user || !user.email) return false;
    return SUPER_ADMIN_EMAILS.includes(user.email.toLowerCase());
};

/**
 * Check if a user has super admin access to a feature
 * Super admins bypass all plan restrictions
 * @param {Object} user - Firebase user object
 * @param {string} feature - Feature to check
 * @returns {boolean} - True if super admin has access
 */
export const hasSuperAdminAccess = (user, feature) => {
    return isSuperAdmin(user);
};

export default {
    isSuperAdmin,
    hasSuperAdminAccess,
    SUPER_ADMIN_EMAILS
};

/**
 * Utility to clean up the database of users 
 * who have unlinked their accounts.
 */
function purgeInactive(db) {
    db.run("DELETE FROM verified_users WHERE last_seen < date('now', '-30 days')");
}

import { User } from "@/models/User";

/**
 * Validates if a user's profile is complete to avoid redirect loops to the setup page.
 * Existing users might not have the explicit 'profileCompleted' flag but do have
 * their main legacy fields populated. 
 */
export function isProfileComplete(user: User | Partial<User> | null): boolean {
    if (!user) return false;

    // Modern completion approach logic
    if (user.profileCompleted === true) return true;

    // Legacy or active user approach
    // If they were created previously but didn't click the 'Complete Profile' button natively previously
    if (user.name && user.contactNumber && user.dateOfBirth) {
        return true;
    }

    return false;
}

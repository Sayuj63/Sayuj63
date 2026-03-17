export class AuthError extends Error {
    constructor(message: string, public status: number = 401) {
        super(message);
        this.name = "AuthError";
    }
}

export const handleAuthError = (error: any) => {
    let message = "An error occurred during authentication.";

    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "Incorrect email or password. Please try again.";
    } else if (error.code === 'auth/too-many-requests') {
        message = "Too many failed attempts. Please try again after some time.";
    } else if (error.message.includes("Forbidden")) {
        message = "You do not have permission to access this area.";
    }

    return { message, status: error.status || 401 };
};

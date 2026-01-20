export function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return "This email is already registered. Please use a different email or try logging in.";
    case 'auth/invalid-credential':
    case 'auth/invalid-email':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return "Invalid login credentials. Please check your email and password and try again.";
    case 'auth/too-many-requests':
      return "Too many failed attempts. Please try again later.";
    case 'auth/weak-password':
      return "Password should be at least 6 characters.";
    case 'auth/network-request-failed':
      return "Network error. Please check your internet connection.";
    default:
      console.error("Unhandled Firebase Auth Error:", errorCode);
      return "An unexpected error occurred. Please try again.";
  }
}

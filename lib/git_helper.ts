
// Method to get the username from the Git URL
export const getUserName = (gitUrl: string): string => {
    const originalGitUrl = gitUrl;

    // Handle SSH URLs
    if (gitUrl.startsWith("git@")) {
        gitUrl = gitUrl.substring(gitUrl.indexOf(":") + 1); // Remove "git@<host>:"
        const parts = gitUrl.split("/");
        if (parts.length < 2) {
            throw new Error(`Invalid git URL: ${originalGitUrl}`);
        }
        return parts[0];
    }

    // Handle HTTP/HTTPS URLs
    if (gitUrl.startsWith("https://") || gitUrl.startsWith("http://")) {
        gitUrl = gitUrl.substring(gitUrl.indexOf("//") + 2); // Remove "https://" or "http://"
        const parts = gitUrl.split("/");
        if (parts.length < 3) {
            throw new Error(`Invalid git URL: ${originalGitUrl}`);
        }
        return parts[1];
    }

    throw new Error(`Invalid git URL: ${originalGitUrl}`);
}

// Method to get the repository name from the Git URL
export const getRepoName = (gitUrl: string): string => {
    const originalGitUrl = gitUrl;

    // Handle SSH URLs
    if (gitUrl.startsWith("git@")) {
        gitUrl = gitUrl.substring(gitUrl.indexOf(":") + 1); // Remove "git@<host>:"
        const parts = gitUrl.split("/");
        if (parts.length < 2) {
            throw new Error(`Invalid git URL: ${originalGitUrl}`);
        }
        return parts[1].replace(".git", "");
    }

    // Handle HTTP/HTTPS URLs
    if (gitUrl.startsWith("https://") || gitUrl.startsWith("http://")) {
        gitUrl = gitUrl.substring(gitUrl.indexOf("//") + 2); // Remove "https://" or "http://"
        const parts = gitUrl.split("/");
        if (parts.length < 3) {
            throw new Error(`Invalid git URL: ${originalGitUrl}`);
        }
        return parts[2].replace(".git", "");
    }

    throw new Error(`Invalid git URL: ${originalGitUrl}`);
}

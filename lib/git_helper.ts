import { BlobSchema, Gitlab, ProjectSchema } from "@gitbeaker/rest";

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

export const findFileGitLab = async (fileFilter: string): Promise<BlobSchema[]> => {
    const api = new Gitlab({
        host: process.env.BASE_GIT_URL,
        token: process.env.PRIVATE_TOKEN,
    });

    const blobs = await api.Search.all("blobs", fileFilter, {
        showExpanded: false
    })
    return blobs.filter(v => v.filename === fileFilter)
}

export const findProjectByIdGitLab = async (projectId: string): Promise<ProjectSchema> => {
    const api = new Gitlab({
        host: process.env.BASE_GIT_URL,
        token: process.env.PRIVATE_TOKEN,
    });

    return await api.Projects.show(projectId)
}


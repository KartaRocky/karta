import { BlobSchema, Gitlab, ProjectSchema, RepositoryFileExpandedSchema } from "@gitbeaker/rest";

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

export const findFileGitLab = async (projectId: string | number, filePath: string, ref: string): Promise<RepositoryFileExpandedSchema> => {
    const api = new Gitlab({
        host: process.env.BASE_GIT_URL,
        token: process.env.PRIVATE_TOKEN,
    });
    return api.RepositoryFiles.show(projectId, filePath, ref)
}

export const findBlobSchemasFileGitLab = async (fileFilter: string): Promise<BlobSchema[]> => {
    const api = new Gitlab({
        host: process.env.BASE_GIT_URL,
        token: process.env.PRIVATE_TOKEN,
    });
    return await api.Search.all("blobs", fileFilter, {
        showExpanded: false
    })
}

export const findProjectByIdGitLab = async (projectId: string | number): Promise<ProjectSchema> => {
    const api = new Gitlab({
        host: process.env.BASE_GIT_URL,
        token: process.env.PRIVATE_TOKEN,
    });

    return await api.Projects.show(projectId)
}

// export const findProjectByIdGithub = async( projectId: string) => {
//     const api = new Octokit(
//         {
//             baseUrl: process.env.BASE_GIT_URL,
//             auth: process.env.PRIVATE_TOKEN
//         }
//     )
//     const repos = await api.repos.listForOrg({org: 'KartaRocky'})
//     console.log(repos);
// }


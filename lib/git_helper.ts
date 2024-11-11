import { BlobSchema, Gitlab, ProjectSchema, RepositoryFileExpandedSchema } from "@gitbeaker/rest";
import { Octokit } from "@octokit/rest";
import { KartaDependency, RepoFileSchema } from "./types";

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

export const findBlobSchemasFileGithub = async (fileFilter: string): Promise<RepoFileSchema[]> => {
    const api = new Octokit(
        {
            baseUrl: process.env.BASE_GIT_URL,
            auth: process.env.PRIVATE_TOKEN
        }
    )
    const result = await api.search.code({
        q: `${fileFilter}+org:${process.env.ORGANIZATION}`,
    })
    console.log('result', result)
    return result.data.items.map(element => ({
        repoFullName: element.repository.full_name,
        repoOwner: element.repository.owner.login,
        repoName: element.repository.name,
        repoUrl: element.repository.html_url,
        fileName: element.name,
        filePath: element.path
    }));
}

export const findFileContentInGitHub = async( owner: string, repo: string, path: string): Promise<KartaDependency[]> => {
    const api = new Octokit(
        {
            baseUrl: process.env.BASE_GIT_URL,
            auth: process.env.PRIVATE_TOKEN
        }
    )

    const { data } = await api.repos.getContent({
        owner: owner,
        repo: repo,
        path: path
    });

    if("content" in data) {
        return JSON.parse(atob(data.content)) as KartaDependency[]
     }
     return Promise.reject("something went wrong when getting karta dependency")
}


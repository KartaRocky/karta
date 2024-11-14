import {
  saveAllSourceDependencies,
  saveSource,
} from "./sources/sourceRepository";
import {
  findBlobSchemasFileGithub,
  findBlobSchemasFileGitLab,
  findFileContentInGitHub,
  findFileGitLab,
  findProjectByIdGitLab,
} from "./git_helper";
import { KartaDependency } from "./types";
import { saveDependency } from "./dependencies/dependencyRepository";

export async function findKartaFileAndUpdateDatabase() {
  console.log("starting finding karta files...");
  if (process.env.GIT_TYPE === "github") {
    const blobSchemas = await findBlobSchemasFileGithub("filename:.karta.json");
    console.log("blobSchemas", blobSchemas);
    blobSchemas.forEach(async (blobSchema) => {
      await saveSource({
        url: blobSchema.repoUrl,
        name: blobSchema.repoName,
        path_with_namespace: blobSchema.repoFullName,
      });

      const dependencies = await findFileContentInGitHub(
        blobSchema.repoOwner,
        blobSchema.repoName,
        blobSchema.filePath
      );
      const dependencyIds: number[] = [];
      dependencies.forEach(async (dep) => {
        const saved = await saveDependency(dep);
        dependencyIds.push(saved?.id || -1);
      });

      await saveAllSourceDependencies(blobSchema.repoUrl, dependencyIds);
    });
  } else {
    const blobSchemas = await findBlobSchemasFileGitLab("path:.karta.json");
    blobSchemas.forEach(async (blobSchema) => {
      const dep = await findFileGitLab(
        blobSchema.project_id,
        blobSchema.path,
        blobSchema.ref
      );
      const project = await findProjectByIdGitLab(blobSchema.project_id);
      await saveSource({
        url: project.web_url,
        name: project.name,
        path_with_namespace: project.path_with_namespace,
      });
      const dependencies = JSON.parse(atob(dep.content)) as KartaDependency[];
      const dependencyIds: number[] = [];
      dependencies.forEach(async (dep) => {
        const saved = await saveDependency(dep);
        dependencyIds.push(saved?.id || -1);
      });

      await saveAllSourceDependencies(project.web_url, dependencyIds);
    });
  }
}

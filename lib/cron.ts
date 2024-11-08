import cron from 'node-cron';
import { saveAllSourceDependencies, saveSource } from './sources/sourceRepository';
import { findBlobSchemasFileGitLab, findFileGitLab, findProjectByIdGitLab } from './git_helper';
import { KartaDependency } from './types';
import { saveDependency } from './dependencies/dependencyRepository';

export async function startCronJob() {
  cron.schedule('* * * * *', async () => { // Every minute
    const blobSchemas = await findBlobSchemasFileGitLab('path:.karta.json')
    blobSchemas.forEach(async (blobSchema) => {
      const dep = await findFileGitLab(blobSchema.project_id, blobSchema.path, blobSchema.ref)
      const project = await findProjectByIdGitLab(blobSchema.project_id)
      await saveSource({url: project.web_url, name: project.name, path_with_namespace: project.path_with_namespace})
      const dependencies = JSON.parse(atob(dep.content)) as KartaDependency[]
      const dependencyIds: number[] = [];
      dependencies.forEach(async (dep) => {
        const saved = await saveDependency(dep)
        dependencyIds.push(saved?.id || -1)
      })

      await saveAllSourceDependencies(project.web_url, dependencyIds)
    })
  });
}
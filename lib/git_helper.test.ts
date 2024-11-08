
/**
 * @jest-environment node
 */
import { getUserName, getRepoName, findBlobSchemasFileGitLab } from '@/lib/git_helper';

describe('GitHelper', () => {
  // Test for HTTPS URLs
  test('getUserName should return the correct username for HTTPS URLs', () => {
    const gitUrl = 'https://github.com/exampleUser/repo.git';
    const expected = 'exampleUser';
    const actual = getUserName(gitUrl);
    expect(actual).toBe(expected);
  });

  // Test for SSH URLs
  test('getUserName should return the correct username for SSH URLs', () => {
    const gitUrl = 'git@github.com:exampleUser/repo.git';
    const expected = 'exampleUser';
    const actual = getUserName(gitUrl);
    expect(actual).toBe(expected);
  });

  // Test for HTTPS URL repository name
  test('getRepoName should return the correct repository name for HTTPS URLs', () => {
    const gitUrl = 'https://github.com/exampleUser/repo.git';
    const expected = 'repo';
    const actual = getRepoName(gitUrl);
    expect(actual).toBe(expected);
  });

  // Test for SSH URL repository name
  test('getRepoName should return the correct repository name for SSH URLs', () => {
    const gitUrl = 'git@github.com:exampleUser/repo.git';
    const expected = 'repo';
    const actual = getRepoName(gitUrl);
    expect(actual).toBe(expected);
  });

  test('findFileGitLab should return something', async () => {
    const res = await findBlobSchemasFileGitLab('path:.karta.json')
    console.log(res)
    //expect(res).si
  })


  // test('findFileGitHub should return something', async () => {
  //   const res = await findProjectByIdGithub('path:.karta.json')
  //   console.log(res)
  //   //expect(res).si
  // })

});

/**
 * @jest-environment node
 */
import { getUserName, getRepoName } from '@/lib/git_helper';
import { describe, expect, test } from 'vitest';

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
});
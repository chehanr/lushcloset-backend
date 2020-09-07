const apiUtils = require('../../src/utils/api');

describe('Api utils tests', () => {
  it('Slugify test', () => {
    expect(apiUtils.makeSlug('Test string')).toBe('test-string');
    expect(apiUtils.makeSlug('Test string 123')).toBe('test-string-123');
    expect(apiUtils.makeSlug('Test string 123 !#@')).toBe('test-string-123-');
    expect(apiUtils.makeSlug('!#@')).toBe('');
    expect(apiUtils.makeSlug('')).toBe('');
    expect(apiUtils.makeSlug(null)).toBe('');
  });
  it('Clean string test', () => {
    expect(apiUtils.cleanString('QWERTYqwerty')).toBe('QWERTYqwerty');
    expect(apiUtils.cleanString('123abcABC')).toBe('123abcABC');
    expect(apiUtils.cleanString('T@$t %tr1ng#')).toBe('Tt tr1ng');
    expect(apiUtils.cleanString('!@#$%^&*()-+=<>?;:"][{}|~,./', 6)).toBe('');
    expect(apiUtils.cleanString('')).toBe('');
    expect(apiUtils.cleanString(null)).toBe('');
  });
  it('Truncate string test', () => {
    expect(apiUtils.truncateString('Test this', 13)).toBe('Test this');
    expect(apiUtils.truncateString('Test this', 12)).toBe('Test this');
    expect(apiUtils.truncateString('Test this', 11)).toBe('Test this');
    expect(apiUtils.truncateString('Test this', 10)).toBe('Test this');
    expect(apiUtils.truncateString('Test this', 9)).toBe('Test this');
    expect(apiUtils.truncateString('Test this', 8)).toBe('Test ...');
    expect(apiUtils.truncateString('Test this', 7)).toBe('Test...');
    expect(apiUtils.truncateString('Test this', 6)).toBe('Tes...');
    expect(apiUtils.truncateString('Test this', 5)).toBe('Te...');
    expect(apiUtils.truncateString('Test this', 4)).toBe('T...');
    expect(apiUtils.truncateString('Test this', 3)).toBe('Tes [...]');
    expect(apiUtils.truncateString('Test this', 2)).toBe('Te [...]');
    expect(apiUtils.truncateString('Test this', 1)).toBe('T [...]');
    expect(apiUtils.truncateString('Test this', 0)).toBe(' [...]');
    expect(apiUtils.truncateString('Test this', 7, '!')).toBe('Test!!!');
    expect(apiUtils.truncateString('Test this', 7, '!', 5)).toBe('Te!!!!!');
    expect(apiUtils.truncateString('')).toBe('');
    expect(apiUtils.truncateString(null)).toBe('');
  });
});

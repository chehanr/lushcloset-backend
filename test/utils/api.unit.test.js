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
});

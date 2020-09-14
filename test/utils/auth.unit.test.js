const authUtils = require('../../src/utils/auth');

describe('Auth utils tests', () => {
  const userObj = {
    id: '4802acaa-9b99-49a8-a465-c7dcdfc951f4',
    email: 'jdoe@email.com',
    name: 'John Doe',
    photoUri:
      'https://www.kroger.com/product/images/xlarge/front/0000000004011',
    createdAt: '2020-07-23T11:25:09.275Z',
    updatedAt: '2020-07-23T12:13:28.930Z',
  };

  it('JWT generation test', () => {
    expect(authUtils.generateJwt(userObj)).toMatch(
      /^[A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$/
    );
  });

  const plainPassword = 'testPassword';

  it('Hash and match password test', async () => {
    const hashedPassword = await authUtils.hashPassword(plainPassword);
    const matchPasswordResult = await authUtils.matchPassword(
      plainPassword,
      hashedPassword
    );
    expect.assertions(6);
    expect(await authUtils.hashPassword(null)).toBeUndefined();
    expect(matchPasswordResult).toBe(true);
    expect(
      await authUtils.matchPassword('invalidPassword', hashedPassword)
    ).toBe(false);
    expect(await authUtils.matchPassword(plainPassword, 'invalidHash')).toBe(
      false
    );
    expect(await authUtils.matchPassword('', '')).toBe(false);
    expect(await authUtils.matchPassword(null, null)).toBe(false);
  });
});

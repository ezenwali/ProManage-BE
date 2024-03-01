import { UserType } from '@prisma/client';
import { AuthUserEntity } from '../../Base/AuthUserEntity';

describe('Test for AuthUserEntity', () => {
  const _date = new Date();

  const user = (userT?: UserType) => ({
    id: 'someId',
    email: 'example@example.com',
    password: 'password',
    createdAt: _date,
    userType: userT ? userT : ('Email_Password' as keyof typeof UserType),
  });

  const authUser = AuthUserEntity.create(user());

  describe('Rendering', () => {
    it('should return the user email', () => {
      expect(authUser.getEmail()).toEqual(user().email);
    });

    it('should return the user creation date', () => {
      expect(authUser.getCreatedAt()).toEqual(user().createdAt);
    });

    it('should return the user type', () => {
      expect(authUser.getUserType()).toEqual(user().userType);
    });
  });

  describe('Password', () => {
    it('should throw an error if account not associated with email and password', async () => {
      const _authUser = AuthUserEntity.create(user('Google'));

      await expect(
        _authUser.verifyHashedPassword('password'),
      ).rejects.toThrow();
    });
  });
});

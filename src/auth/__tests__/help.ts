import { SaveVerificationCodeEntity } from '../Base/SaveVerificationCodeEntity';

export const codeDetail = {
  email: 'email@example.com',
  id: 'hello',
  createdAt: new Date(),
};

export const _codeDetails = SaveVerificationCodeEntity.create(codeDetail);

export const userDto = {
  email: 'email@example.com',
  password: '$password',
};

export const hashedEquivOf$password =
  '$argon2id$v=19$m=65536,t=3,p=4$6RW5erMhJN6QxY9+7LwRMQ$7iYuzJV69SJmqRgoFNs2FjbZSdTyyrV30X2U4jy/Kxg';

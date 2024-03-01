export interface IsendUserOtp {
  email: string;
  code: string;
}

export interface IwelcomeMail {
  email: string;
}

export abstract class IEmailService {
  abstract sendUserOtp(user: IsendUserOtp): Promise<void>;
  abstract sendWelcomeEmail(email: IwelcomeMail): void;
}

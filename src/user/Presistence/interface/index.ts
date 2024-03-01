export abstract class IUserRepository {
  abstract getUserProfile(id: string): Promise<void>;
}

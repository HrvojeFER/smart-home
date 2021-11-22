import { BehaviorSubject } from 'rxjs';

export class UserStatus extends BehaviorSubject<number> {
  public static null = 0;
  public static initialized = 1;
  public static loggedIn = 2;
  public static emailVerified = 3;
  public static pendingApproval = 4;
  public static blocked = 5;
  public static approved = 6;
  public static admin = 7;

  constructor(status: number) {
    super(status);
  }

  public setStatus(status: number) {
    this.next(status);
  }
}

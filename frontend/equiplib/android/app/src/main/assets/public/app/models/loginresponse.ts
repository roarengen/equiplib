import { Organization } from "./organization";
import { User } from "./user";

export class LoginResponse {
  user! : User;
  token! : string;
  org! : Organization
}

export class User {
  roleid!: number;
  username!: string;
  firstname!: string;
  lastname!: string;
  token!: string;
  email!: string;
  phone!: string;
  membershipId!: string;
  city!: string;
  postalcode!: string;
  dateOfBirth!: Date;
  activeFromDate!: Date;
  activeToDate!: Date;
  organizationid!: number;
  id!: number;
}

export class createUser extends User {
  password!: string;
}

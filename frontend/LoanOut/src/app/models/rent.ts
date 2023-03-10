export class Rent {
  id!: number;
  userid!: number;
  equipmentid!: number;
  rentedFromDate!: Date;
  rentedToDate!: Date;
  rentedValidToDate!: Date;
  purpose!: string;
  comment!: string;
  rentedFromLocation!: number;
  DeliveredToLocation!: number;
}

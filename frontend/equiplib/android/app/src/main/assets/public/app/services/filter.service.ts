import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FilterService {

  filterdata: any[];
  constructor() { }

  get data(): any{
    return this.filterdata;
  }

  set data(val: any){
    this.filterdata = val;
  }

}

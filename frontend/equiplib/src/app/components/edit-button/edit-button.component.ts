import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss'],
})
export class EditButtonComponent  implements OnInit {

  @Input() public editButton: boolean = false;
  @Input() public deleteButton: boolean = false;
  @Input() public qrButton: boolean = false;
  @Input() public href: string;
  @Input() public setFilterServiceId: number;

  constructor(
    public router: Router,
    public filterService: FilterService,
  ) { }

  ngOnInit() {}

  async onClickButton(href: any) {
    console.log(this.setFilterServiceId)
    this.filterService.data = this.setFilterServiceId
    this.router.navigate([href])
  }
}

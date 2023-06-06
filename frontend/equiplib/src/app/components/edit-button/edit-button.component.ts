import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(
    public router: Router,
  ) { }

  ngOnInit() {}


  onClickButton(href: any) {
    this.router.navigate([href, {state: {}}])
  }
}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss'],
})
export class EditButtonComponent  implements OnInit {

  @Input() public typeOfButton: string;
  @Input() public href: string;
  @Input() public color: string;

  constructor() { }

  ngOnInit() {}

}

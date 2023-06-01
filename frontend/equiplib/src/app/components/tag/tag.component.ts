import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent  implements OnInit {
  @Input() name: string;
  @Input() color: string;
  @Input() editable: boolean = false;
  @Input() checked: boolean = false;
  alpha: string =  "7a"

  constructor() { }

  ngOnInit() {}

  toggleChecked() {
    this.checked = !this.checked;
  }
}

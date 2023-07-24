import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {AddTagComponent} from './add-tag.component';
import { ColorPickerModule } from 'ngx-color-picker';
import {TagModule } from "../../components/tag/tag.module"

@NgModule({
    declarations: [AddTagComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        IonicModule,
        ColorPickerModule,
        TagModule
    ]
})
export class AddTagModule { }

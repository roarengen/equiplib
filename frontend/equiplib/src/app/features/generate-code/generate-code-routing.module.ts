import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerateCodePage } from './generate-code.page';

const routes: Routes = [
  {
    path: '',
    component: GenerateCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateCodePageRoutingModule {}

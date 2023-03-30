import { NgModule } from '@angular/core';
import { FilterOnRoleIdPipe } from './user-filter.pipe';

@NgModule({
  declarations: [FilterOnRoleIdPipe],
  exports: [FilterOnRoleIdPipe]
})
export class PipesModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoiDetailComponent } from './poi-detail.component';

const routes: Routes = [
  {
    path: '',
    component: PoiDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoiDetailRoutingModule {}


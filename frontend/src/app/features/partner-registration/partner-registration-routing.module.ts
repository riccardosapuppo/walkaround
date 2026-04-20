import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartnerRegistrationComponent } from './partner-registration.component';

const routes: Routes = [
  {
    path: '',
    component: PartnerRegistrationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerRegistrationRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompleteRegistrationComponent } from './complete-registration.component';

const routes: Routes = [
  {
    path: '',
    component: CompleteRegistrationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompleteRegistrationRoutingModule {}

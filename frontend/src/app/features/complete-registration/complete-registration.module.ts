import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CompleteRegistrationRoutingModule } from './complete-registration-routing.module';
import { CompleteRegistrationComponent } from './complete-registration.component';

@NgModule({
  declarations: [CompleteRegistrationComponent],
  imports: [SharedModule, CompleteRegistrationRoutingModule]
})
export class CompleteRegistrationModule {}

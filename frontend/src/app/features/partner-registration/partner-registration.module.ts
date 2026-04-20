import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PartnerRegistrationRoutingModule } from './partner-registration-routing.module';
import { PartnerRegistrationComponent } from './partner-registration.component';

@NgModule({
  declarations: [PartnerRegistrationComponent],
  imports: [SharedModule, PartnerRegistrationRoutingModule]
})
export class PartnerRegistrationModule {}

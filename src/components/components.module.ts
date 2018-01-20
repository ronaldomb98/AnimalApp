import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';
@NgModule({
	declarations: [LoginComponent,
    SignupComponent,
  ],
	imports: [],
	exports: [LoginComponent,
    SignupComponent,
    ]
})
export class ComponentsModule {}

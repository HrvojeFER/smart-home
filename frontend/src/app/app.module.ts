// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Routing module
import { AppRoutingModule } from './app-routing.module';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UiSwitchModule } from 'ngx-ui-switch';

// Provider
import { Provider } from './provider/abstractProvider';
import { ArduinoProvider } from './provider/implementations/arduinoProvider';
import { WebServerProvider } from './provider/implementations/webServerProvider';
import { FrontendDebugProvider } from './provider/implementations/frontendDebugProvider';
import { providerFactory } from './provider/providerFactory';

//  Components
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { StatusPageComponent } from './pages/status-page/status-page.component';
import { PresetComponent } from './pages/preset/preset.component';
import { UserComponent } from './pages/user/user.component';
// Auth
import { SignInComponent } from './pages/signin/signin.component';
import { SignUpComponent } from './pages/signup/signup.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
// Arduino
import { AdminComponent } from './pages/admin/admin.component';
import { PendingComponent } from './pages/pending/pending.component';
import { BlockedComponent } from './pages/blocked/blocked.component';
import { ArduinoConfComponent } from './pages/arduino-conf/arduino-conf.component';
// App
import { AppComponent } from './app.component';

//  Services
// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
// Auth
import { AuthService } from './services/auth/auth.service';
// Preset
import { PresetService } from './services/preset/preset.service';
import { FirebasePresetService } from './services/preset/firebasePreset.service';
import { presetFactory } from './services/preset/presetFactory';
// Firestore
import { FirestoreService } from './services/firestore/firestore.service';
// User
import { UserService } from './services/user/user.service';

// Environment
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavbarComponent,
    StatusPageComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    PresetComponent,
    ArduinoConfComponent,
    AdminComponent,
    PendingComponent,
    BlockedComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    ReactiveFormsModule,
    FormsModule,
    UiSwitchModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [
    {
      provide: Provider,
      useFactory: providerFactory,
      deps: [ArduinoProvider]
    },
    {
      provide: PresetService,
      useFactory: presetFactory,
      deps: [FirebasePresetService]
    },
    AuthService,
    FirestoreService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

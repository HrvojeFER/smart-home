import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Routing components
import { HomePageComponent } from './pages/home-page/home-page.component';
import { StatusPageComponent } from './pages/status-page/status-page.component';
import { SignInComponent } from './pages/signin/signin.component';
import { SignUpComponent } from './pages/signup/signup.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { AdminComponent } from './pages/admin/admin.component';
import { PendingComponent } from './pages/pending/pending.component';
import { ArduinoConfComponent } from './pages/arduino-conf/arduino-conf.component';
import { PresetComponent } from './pages/preset/preset.component';
import { BlockedComponent } from './pages/blocked/blocked.component';
import { UserComponent } from './pages/user/user.component';

// Import canActivate guard services
import { ApprovedGuard } from './services/guard/approved.guard';
import { NotLoggedInGuard } from './services/guard/not-logged-in.guard';
import { ArduinoGuard } from './services/guard/arduino.guard';
import { AdminGuard } from './services/guard/admin.guard';
import { PendingGuard } from './services/guard/pending.guard';
import { VerifyEmailGuard } from './services/guard/verify-email.guard';
import { BlockedGuard } from './services/guard/blocked.guard';
import { UserGuard } from './services/guard/user.guard';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard]
  },

  {
    path: 'home',
    component: HomePageComponent,
    canActivate: [ApprovedGuard]
  },
  {
    path: 'status',
    component: StatusPageComponent,
    canActivate: [ApprovedGuard]
  },
  {
    path: 'preset',
    component: PresetComponent,
    canActivate: [ApprovedGuard]
  },

  {
    path: 'pending',
    component: PendingComponent,
    canActivate: [PendingGuard]
  },
  {
    path: 'blocked',
    component: BlockedComponent,
    canActivate: [BlockedGuard]
  },

  {
    path: 'arduino-conf',
    component: ArduinoConfComponent,
    canActivate: [ArduinoGuard]
  },

  {
    path: 'user',
    component: UserComponent,
    canActivate: [UserGuard]
  },

  {
    path: 'verify-email',
    component: VerifyEmailComponent,
    canActivate: [VerifyEmailGuard]
  },

  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [NotLoggedInGuard]
  },
  {
    path: 'register-user',
    component: SignUpComponent,
    canActivate: [NotLoggedInGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [NotLoggedInGuard]
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

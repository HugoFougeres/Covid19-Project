import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { HomepageComponent } from './homepage/homepage.component';
import { SecurePagesGuard } from './secure-pages.guard';
import { SigninComponent } from './signin/signin.component';
import { CountryComponent } from './country/country.component';

const routes: Routes = [
  { path: "signin", component: SigninComponent,
  canActivate: [SecurePagesGuard]},
  { path: "homepage", component: HomepageComponent, 
  canActivate: [AuthGuard]},
  { path: "", pathMatch: "full", redirectTo: "signin"},
  { path: "homepage/:id", component: CountryComponent},
];

@NgModule({ 
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

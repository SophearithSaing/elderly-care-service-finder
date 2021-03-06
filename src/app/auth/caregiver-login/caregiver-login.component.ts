import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-caregiver-login',
  templateUrl: './caregiver-login.component.html',
  styleUrls: ['./caregiver-login.component.css']
})
export class CaregiverLoginComponent {

  isLoading = false;
  validUser = false;

  showErrorMessage: boolean;

  constructor(public authService: AuthService, private router: Router) {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
    setTimeout(() => {
      this.validUser = this.authService.getIsAuth();
      console.log('valid user value is ' + this.validUser);
      if (this.validUser === true) {
        this.router.navigate(['/caregiver-home']);
      } else {
        this.isLoading = false;
        this.showErrorMessage = true;
      }
    }, 2000);
  }

}

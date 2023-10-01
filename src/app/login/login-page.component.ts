import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  public form: FormGroup;
  get password(): AbstractControl { return this.form.controls['password']; }
  get username(): AbstractControl { return this.form.controls['username']; }


  public loading = false;
  public submitted = false

  public returnUrl: string;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
        return;
    }
    this.loading = true;
    this.authService.login(
      {
        username: this.username.value,
        password: this.password.value
      }).subscribe({ next: response => {this.router.navigate([this.returnUrl])},
                            error: (error: any) => {this.error = this.translate.instant("Username or Password invalid")}});
  }
  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ParsissCRMFrontend';
  private _selectedLanguage = 'fa';

  textDir: 'rtl' | 'ltr' = 'rtl';

  get selectedLanguage(): string {
    return this._selectedLanguage;
  }
  set selectedLanguage(value: string) {
    this._selectedLanguage = value;
    this.textDir = this._selectedLanguage === 'fa' ? 'rtl' : 'ltr';
    this.translate.use(value);
  }

  constructor(
    public translate: TranslateService,
    private router: Router
    ) {
    translate.addLangs(['en', 'fa']);
    translate.setDefaultLang('fa');
    this.selectedLanguage = 'fa';
  }

}

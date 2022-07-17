import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ParsissCRMFrontend';
  private _selectedLanguage = 'fa';

  get selectedLanguage(): string {
      return this._selectedLanguage;
  }
  set selectedLanguage(value: string) {
      this._selectedLanguage = value;
      this.translate.use(value);
  }

  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'fa']);
    translate.setDefaultLang('fa');
    this.selectedLanguage = 'fa';
  }
}

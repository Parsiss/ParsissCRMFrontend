import {Component, Inject, Injectable, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import {AutofillService} from "./autofill.service";
import {ReportsListComponent} from "./reports-list-component/reports-list.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
@Injectable()
export class AppComponent {
  title = 'ParsissCRMFrontend';
  private _selectedLanguage = 'fa';

  public textDir: 'rtl' | 'ltr' = 'rtl';

  date = new Date();

  get selectedLanguage(): string {
    return this._selectedLanguage;
  }
  set selectedLanguage(value: string) {
    this._selectedLanguage = value;
    this.textDir = this._selectedLanguage === 'fa' ? 'rtl' : 'ltr';
    this.document.documentElement.lang = this._selectedLanguage;
    this.translate.use(value);
  }

  constructor(
    public translate: TranslateService,
    private router: Router, @Inject(DOCUMENT) private document: Document
    ) {
    translate.addLangs(['en', 'fa']);
    translate.setDefaultLang('fa');
    this.selectedLanguage = 'fa';
    localStorage.removeItem('ReportsList_internalFilter')
    localStorage.removeItem('currentDate')
  }

  @ViewChild('childComponentRef', { static: true }) childComponent: ReportsListComponent;

  handleButtonClick() {
    // Call the method in the child component
    this.childComponent.onMenuReportFilterClick();
    console.log('dfgdg');
  }
}

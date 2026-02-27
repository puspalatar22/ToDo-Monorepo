import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly LANG_KEY = 'app_lang';

  // BehaviorSubject holds current lang — any component can subscribe
  private langSubject = new BehaviorSubject<string>(this.getSavedLang());
  currentLang$ = this.langSubject.asObservable();

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use(this.langSubject.value);   
  }

  get currentLang(): string {
    return this.langSubject.value;
  }

  switchLanguage() {
    const newLang = this.currentLang === 'en' ? 'hi' : 'en';
    this.langSubject.next(newLang);
    this.translate.use(newLang);
    localStorage.setItem(this.LANG_KEY, newLang); 
  }

  private getSavedLang(): string {
    return localStorage.getItem(this.LANG_KEY) ?? 'en';  
  }
}
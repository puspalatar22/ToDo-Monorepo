import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  constructor(private translate: TranslateService) {   }

  init(){
    const savedLang = localStorage.getItem('lang') || 'en';
    this.translate.setDefaultLang('en');
    this.translate.use(savedLang);
  }

  switchLanguage(lang: string){
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }

  currentLang(){
    return this.translate.currentLang;
  }
}
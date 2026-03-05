import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {

  constructor(private translate: TranslateService) {}

  init() {
    const savedLang = this.getCookie('lang') || 'en';

    this.translate.setDefaultLang('en');
    this.translate.use(savedLang);
  }

  switchLanguage(lang: string) {
    document.cookie = `lang=${lang}; path=/`;

    this.translate.use(lang);
  }

  currentLang() {
    return this.translate.currentLang || this.getCookie('lang') || 'en';
  }

  private getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');

    for (let c of cookies) {
      const [key, value] = c.trim().split('=');

      if (key === name) {
        return value;
      }
    }

    return null;
  }
}
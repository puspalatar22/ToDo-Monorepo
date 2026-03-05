import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'shared-i18n';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'login-app';

  constructor(private langservice: LanguageService){}

  ngOnInit() {
    this.langservice.init();
  }
}

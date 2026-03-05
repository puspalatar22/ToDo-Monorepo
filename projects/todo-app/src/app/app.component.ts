import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LanguageService } from 'shared-i18n';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private store: Store, private langService: LanguageService){}

  ngOnInit(){
    this.langService.init();
  }
  title = 'todo-app';
}

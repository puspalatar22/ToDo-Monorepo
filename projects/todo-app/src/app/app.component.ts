import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadTasks } from './features/tasks/state/task.actions';
import { restoreSession } from './features/tasks/state/auth-state/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private store: Store){}

  ngOnInit(){
    this.store.dispatch(restoreSession());
  }
  title = 'todo-app';
}

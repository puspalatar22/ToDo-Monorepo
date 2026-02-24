import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TaskActions from './task.actions';
import { LocalStorageService } from 'shared-services';
import { tap, withLatestFrom, map } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllTasks } from './task.selector';

@Injectable()
export class TaskEffects {
  constructor(
    private actions$: Actions,
    @Inject(LocalStorageService) private storageService: LocalStorageService,
    private store: Store,
  ) {}

  persistTasks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TaskActions.addTask,
          TaskActions.updateTask,
          TaskActions.deleteTask,
          TaskActions.toggleTaskCompletion,
        ),
        withLatestFrom(this.store.select(selectAllTasks)),
        tap(([_, tasks]) => {
          this.storageService.saveTasks(tasks);
        }),
      ),
    { dispatch: false },
  );

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      map(() => {
        const tasks = this.storageService.loadTasks();
        return TaskActions.loadTasksSuccess({ tasks });
      }),
    ),
  );
}

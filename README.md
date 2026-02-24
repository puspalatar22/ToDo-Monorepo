# Todo Application — Angular Monorepo

A production-like Todo application built with Angular 14, NgRx 14, and ngx-translate, structured as an Angular CLI Monorepo workspace.

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Angular | 14.2.x | Core framework |
| Angular CLI | 14.2.x | Monorepo workspace management |
| NgRx Store | 14.3.x | State management |
| NgRx Effects | 14.3.x | Side effects (localStorage sync) |
| NgRx Entity | 14.3.x | Normalized entity state |
| ngx-translate | 14.x | Internationalization (i18n) |
| TypeScript | 4.8.x | Static typing |

---

## Prerequisites

Ensure the following are installed on your machine:

- **Node.js** >= 16.x
- **npm** >= 8.x
- **Angular CLI** 14.2.x

```bash
npm install -g @angular/cli@14.2.0
```

---

## Setup Steps

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd todo-monorepo
```

### 2. Install dependencies

```bash
npm install
```

> If you encounter peer dependency conflicts, use:
> ```bash
> npm install --legacy-peer-deps
> ```

### 3. Build libraries in order

Libraries must be built before serving the app. Always build in this order:

```bash
ng build models
ng build shared-services
ng build ui-components
```

> **Note:** Rebuild libraries whenever you make changes to them.

### 4. Serve the application

```bash
ng serve todo-app
```

Navigate to `http://localhost:4200`

### 5. Run tests

```bash
ng test todo-app
```

---

## Project Structure

```
todo-monorepo/
├── projects/
│   ├── todo-app/                          # Main application
│   │   └── src/
│   │       └── app/
│   │           ├── core/                  # Core module 
│   │           ├── features/
│   │           │   └── tasks/             # Tasks feature module
│   │           │       ├── components/   
│   │           │       └── state/         # NgRx store for tasks
│   │           │           ├── task.actions.ts
│   │           │           ├── task.reducer.ts
│   │           │           ├── task.effects.ts
│   │           │           ├── task.selectors.ts
│   │           │           └── task.state.ts
│   │           ├── assets/
│   │           │   └── i18n/              # Translation files
│   │           │       ├── en.json
│   │           │       └── ar.json
│   │           └── app.module.ts
│   │
│   ├── models/                            # Library: interfaces & types
│   │   └── src/
│   │       ├── lib/
│   │       │   ├── task.model.ts          # Task interface
│   │       │   └── toast.model.ts         # Toast interface
│   │       └── public-api.ts
│   │
│   ├── shared-services/                   # Library: reusable services
│   │   └── src/
│   │       ├── lib/
│   │       │   ├── local-storage.service.ts
│   │       │   └── toast.service.ts
│   │       └── public-api.ts
│   │
│   └── ui-components/                     # Library: reusable UI components
│       └── src/
│           ├── lib/
│           │   ├── todo-form/
│           │   ├── todo-button/
│           │   ├── toast/
│           │   └── ui-components.module.ts
│           └── public-api.ts
│
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

### Library Responsibilities

| Library | Description |
|---|---|
| `models` | Shared TypeScript interfaces and types (`Task`, `Toast`) |
| `shared-services` | Singleton services used across the app (`LocalStorageService`, `ToastService`) |
| `ui-components` | Reusable presentational (dumb) components (`TodoForm`, `TodoButton`, `Toast`) |

---

## NgRx Flow

The application follows a strict **unidirectional data flow**:

```
Component → Action → Reducer → Store → Selector → Component
                  ↘ Effect → LocalStorageService
```

### 1. State Shape

```typescript
// task.state.ts
export interface TaskState extends EntityState<Task> {
  loading: boolean;
  error: string | null;
}
```

### 2. Actions

All user interactions dispatch an action:

| Action | Trigger |
|---|---|
| `loadTasks` | App initialization |
| `loadTasksSuccess` | After tasks are read from localStorage |
| `addTask` | User submits new task form |
| `editTask` | User saves edited task |
| `deleteTask` | User confirms delete |
| `toggleTask` | User clicks complete / pending |

### 3. Reducer

A pure function that produces the next immutable state using `EntityAdapter`:

```typescript
// task.reducer.ts
const taskReducer = createReducer(
  initialState,
  on(loadTasksSuccess, (state, { tasks }) => adapter.setAll(tasks, state)),
  on(addTask,    (state, { task })         => adapter.addOne(task, state)),
  on(updateTask,   (state, { task })         => adapter.upsertOne(task, state)),
  on(deleteTask, (state, { id })           => adapter.removeOne(id, state)),
  on(toggleTask, (state, { id })           => adapter.updateOne(
    { id, changes: { completed: !state.entities[id]?.completed } }, state
  ))
);
```

### 4. Selectors

Derived state is accessed through memoized selectors:

```typescript
// task.selectors.ts
export const selectAllTasks       = createSelector(selectTaskState, selectAll);
export const selectCompletedTasks = createSelector(selectAllTasks, tasks => tasks.filter(t => t.completed));
export const selectActiveTasks    = createSelector(selectAllTasks, tasks => tasks.filter(t => !t.completed));
```

### 5. Effects

Effects handle all side effects

```typescript
// task.effects.ts

// On app init — load from localStorage
loadTasks$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadTasks),
    map(() => loadTasksSuccess({ tasks: this.storageService.load() }))
  )
);

// After every mutation — save to localStorage
 persistTasks$ = createEffect(() =>
  this.actions$.pipe(
    ofType(addTask, editTask, deleteTask, toggleTask),
    withLatestFrom(this.store.select(selectAllTasks)),
    tap(([, tasks]) => this.storageService.save(tasks))
  ), { dispatch: false }
);
```

### 6. Component Usage

Components dispatch actions and subscribe to selectors — never mutate state directly:

```typescript
// In component
tasks$ = this.store.select(selectAllTasks);

handleSaveTask(task: Task): void {
  this.store.dispatch(addTask({ task }));
  this.store.dispatch(editTask({ task }));
}
```

---

## How Translation is Configured

The application uses **ngx-translate** for internationalization with JSON-based translation files.

### Supported Languages

| Code | Language |
|---|---|
| `en` | English (default) |
| `hi` | Hindi |

### Configuration

`TranslateModule` is configured in `AppModule` using `TranslateHttpLoader`, which loads translation files from `assets/i18n/`:

```typescript
// app.module.ts
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    })
  ]
})
export class AppModule {}
```

### Translation Files

```json
// assets/i18n/en.json
{
  "APP": { "TITLE": "Todo Application" },
  "TASKS": {
    "ADD": "Add Task",
    "EDIT": "Edit Task",
    "DELETE": "Delete",
    "COMPLETE": "Mark Complete",
    "PENDING": "Mark Pending",
    "PLACEHOLDER": "What needs to be done?",
    "EMPTY": "No tasks yet. Add one!"
  },
  "FILTER": {
    "ALL": "All",
    "ACTIVE": "Active",
    "COMPLETED": "Completed"
  },
  "TOAST": {
    "ADDED": "Task added successfully!",
    "UPDATED": "Task updated successfully!",
    "DELETED": "Task deleted."
  }
}
```

### Usage in Templates

```html
<!-- Using the translate pipe -->
<h1>{{ 'APP.TITLE' | translate }}</h1>
<button>{{ 'TASKS.ADD' | translate }}</button>
```

### Switching Languages

The `LangSwitcherComponent` handles runtime language switching. The selected language is persisted to localStorage so the preference survives page reloads:

```typescript
switchLanguage(lang: string): void {
  this.translate.use(lang);
  localStorage.setItem('lang', lang);
}
```

## Available Scripts

```bash
# Build all libraries in correct order
npm run build:libs

# Serve the app (builds libs first)
npm start

---

## Features

- [x] Add new task with title and description
- [x] Edit existing task
- [x] Delete task
- [x] Mark task as complete / pending
- [x] State persisted to localStorage via NgRx Effects
- [x] Toast notifications for user actions
- [x] Multi-language support (English / Hindi)
- [x] Language preference persisted across sessions

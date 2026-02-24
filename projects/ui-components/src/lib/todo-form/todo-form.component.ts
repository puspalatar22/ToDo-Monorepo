import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Task } from 'models';

@Component({
  selector: 'ui-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
})
export class TodoFormComponent implements OnInit {
  form: FormGroup;

  titlePlaceholder = '';
  descriptionPlaceholder = '';
  addButtonText = '';

  @Output() submitTask = new EventEmitter<Task>();
  @Input() task: Task | null = null;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      title: [this.task?.title || ''],
      description: [this.task?.description || ''],
    });

    // Dynamic translation for placeholders as shown before
    this.titlePlaceholders();
  }

  private titlePlaceholders() {
    this.translate
      .get('TASK_LIST.TITLE_PLACEHOLDER')
      .subscribe((res: string) => {
        this.titlePlaceholder = res;
      });
    this.translate
      .get('TASK_LIST.DESCRIPTION_PLACEHOLDER')
      .subscribe((res: string) => {
        this.descriptionPlaceholder = res;
      });
      this.task ? this.translate.get('TASK_LIST.EDIT_TASK').subscribe((res: string) => {
        this.addButtonText = res;
      }) : this.translate.get('TASK_LIST.ADD_TASK').subscribe((res: string) => {
        this.addButtonText = res;
      }); 
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitTask.emit(this.form.value);
      this.form.reset();
    }
  }
}

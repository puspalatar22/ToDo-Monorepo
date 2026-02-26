import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FormConfig, Task } from 'models';

@Component({
  selector: 'ui-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
})
export class TodoFormComponent implements OnInit {
  @Input() config!: FormConfig;
  @Input() initialValues: Record<string, any> = {};
  @Output() submitForm = new EventEmitter<Record<string, any>>();

  form!: FormGroup;
  placeholders: Record<string, string> = {};
  submitButtonText: string = '';

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.buildForm();
    this.loadTranslations();
  }

  ngOnChanges() {
    if (this.form) {
      this.buildForm();
      this.loadTranslations();
    }
  }

  private buildForm() {
    const controls: Record<string, any> = {};
    this.config.fields.forEach((field) => {
      controls[field.name] = [
        this.initialValues[field.name] || '',
        field.validators || [],
      ];
    });

    this.form = this.fb.group(controls);
  }

  private loadTranslations() {
    this.config.fields.forEach((field) => {
      this.translate.get(field.translationKey).subscribe((translated) => {
        this.placeholders[field.name] = translated;
      });
    });

    this.translate.get(this.config.submitButtonKey).subscribe((res) => {
      this.submitButtonText = res;
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);

      if(this.config.resetOnSubmit !== false){
        this.form.reset();
      }
    }
  }
}

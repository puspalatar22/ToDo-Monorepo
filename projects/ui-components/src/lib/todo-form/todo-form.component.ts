import {
  Component,
  EventEmitter,
  OnInit,
  OnChanges,
  OnDestroy,
  Output,
  Input,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { FormConfig } from 'models';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ui-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
})
export class TodoFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() config!: FormConfig;
  @Input() initialValues: Record<string, any> = {};
  @Output() submitForm = new EventEmitter<Record<string, any>>();

  form!: FormGroup;
  placeholders: Record<string, string> = {};
  submitButtonText = '';

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.resolveTranslations();
    this.subscribeToLangChange();
  }

  ngOnChanges() {
    if (this.form) {
      this.buildForm();
      this.resolveTranslations();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Form 
  private buildForm() {
    const controls: Record<string, any> = {};

    this.config.fields.forEach((field) => {
      controls[field.name] = [
        this.initialValues[field.name] ?? '',
        field.validators ?? [],
      ];
    });

    this.form = this.fb.group(controls);
  }

  // Translations 
  private resolveTranslations() {
    // Batch all keys in one call
    const keys = [
      ...this.config.fields.map((f) => f.translationKey),
      this.config.submitButtonKey,
    ];

    this.translate.get(keys).subscribe((translations) => {
      this.config.fields.forEach((field) => {
        this.placeholders[field.name] = translations[field.translationKey];
      });
      this.submitButtonText = translations[this.config.submitButtonKey];
    });
  }

  private subscribeToLangChange() {
    // onLangChange fires after translate.use() completes — most reliable hook
    this.translate.onLangChange.pipe(
      takeUntil(this.destroy$)
    ).subscribe((_event: LangChangeEvent) => {
      this.resolveTranslations();
    });
  }

  isInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }

  // Submit 
  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);

      if (this.config.resetOnSubmit !== false) {
        this.form.reset();
      }
    }
  }
}
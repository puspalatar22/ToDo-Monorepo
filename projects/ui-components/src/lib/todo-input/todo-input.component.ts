import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'lib-todo-input',
  templateUrl: './todo-input.component.html',
  styleUrls: ['./todo-input.component.scss'],
  providers:[{
    provide: NG_VALUE_ACCESSOR,
    useExisting: TodoInputComponent,
    multi: true
  }]
})
export class TodoInputComponent implements ControlValueAccessor {

  @Input() placeholder = '';
  value= '';

  @Output() valueChange = new EventEmitter<string>();

 onChange(event: Event): void {
  const value = (event.target as HTMLInputElement)?.value ?? '';
  // now use value safely
  this.valueChange.emit(value);
}
  onTouched = () =>{};

  writeValue(val: string){
    this.value = val;
  }
  registerOnChange(fn: any){
    this.onChange = fn;
  }
  registerOnTouched(fn: any){
    this.onTouched = fn;
  }
 

}

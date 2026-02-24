import { Component, OnInit, Inject } from '@angular/core';
import { ToastService } from 'shared-services';

@Component({
  selector: 'ui-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent  {

  constructor(@Inject(ToastService) private toastService: ToastService){}

  toast$ = this.toastService.toasts;
  dismiss(id: string): void { this.toastService.dismiss(id); }


}

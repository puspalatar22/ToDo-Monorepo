import { Injectable } from "@angular/core";
import { Toast } from "models";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn: 'root'})

export class ToastService {
    private toast$ = new BehaviorSubject<Toast[]>([]);
    toasts =this.toast$.asObservable();

    show(message: string, type: Toast['type']='info'):void{
        const toast: Toast ={id: crypto.randomUUID(), message, type};
        this.toast$.next([...this.toast$.getValue(), toast]);

        setTimeout(()=>(this.dismiss(toast.id)),2000)
    }

     dismiss(id: string): void {
    this.toast$.next(this.toast$.value.filter(t => t.id !== id));
  }

}
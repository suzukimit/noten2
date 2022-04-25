import {Component, TemplateRef} from '@angular/core';
import {ToastService} from '../service/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  host: {'class': 'toast-container position-fixed fixed-bottom p-3', 'style': 'z-index: 1200; max-width: 500px;'}
})
export class ToastComponent {

  constructor(public toastService: ToastService) {
  }
  isTemplate(toast) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}


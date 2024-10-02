import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'form-group',
  templateUrl: './form.group.component.html',
  styleUrls: ['./form.group.component.scss']
})
export class FormGroupComponent implements OnInit {
  constructor() { }
  @Input() form: FormGroup = null;
  @Input() type: string = 'text';
  @Input() name: string = '';
  @Input() labelName: string = '';
  @Input() controlName: string = '';
  @Input() placeHolder: string = '';
  @Input() options: string[] = [];
  @Input() optionValue: string = '';
  @Input() optionLabel: string = '';
  @Input() rows: number = 0;

  ngOnInit(): void {
    if (this.name && !this.labelName) {
      this.labelName = this.name.substring(0, 1).toUpperCase() + this.name.substring(1);
    }
  }

  isInputType(): boolean {
    return ['text', 'email', 'password'].includes(this.type);
  }

  isSelectType(): boolean {
    return this.type === 'select';
  }

  isTextareaType(): boolean {
    return this.type === 'textarea';
  }
}

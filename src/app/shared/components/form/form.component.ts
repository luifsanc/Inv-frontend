import { Component, Injector, OnInit, Signal, Type } from '@angular/core';
import { FormService } from '../../../core/services/modals/form/form.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  isOpen: Signal<boolean>;
  title: Signal<string>;
  icon: Signal<string>;
  content: Signal<Type<unknown> | null>;

  constructor(private formService: FormService) {
    this.isOpen = this.formService.isOpen;
    this.title = this.formService.modalTitle;
    this.icon = this.formService.modalIcon;
    this.content = this.formService.modalContent;

  }
  ngOnInit() {}

  close() {
    this.formService.close();
  }
}

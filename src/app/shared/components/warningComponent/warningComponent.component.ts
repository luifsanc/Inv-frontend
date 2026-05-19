import { Component, OnInit } from '@angular/core';
import { WarningService } from '../../../core/services/modals/warning/warning.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-warningComponent',
  standalone: true,
  imports:[MatIconModule,CommonModule],
  templateUrl: './warningComponent.component.html',
  styleUrls: ['./warningComponent.component.css'],
})
export class WarningComponentComponent {

  constructor(public warningDialog: WarningService) {}

  confirm() {
    this.warningDialog.confirm();
  }

  cancel() {
    this.warningDialog.cancel();
  }
}

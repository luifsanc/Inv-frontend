import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalDialogService } from '../../../core/services/modals/modalDialog/modalDialog.service';

@Component({
  selector: 'app-message-dialog',
  standalone: true,
  imports: [MatButtonModule, CommonModule,MatIconModule,MatDialogModule],
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css'],
})
export class MessageDialogComponent implements OnInit {
 constructor( public modalDialog: ModalDialogService) {}

  get type() {
    return this.modalDialog.type();
  }

  get title() {
    return this.modalDialog.title();
  }

  get message() {
    return this.modalDialog.message();
  }

  get icon() {
    return this.type === 'success' ? 'check_circle' : 'error';
  }

  close() {
    this.modalDialog.close();
  }

  ngOnInit(): void {}
}

import { computed, Injectable, signal, Type } from '@angular/core';
import { MessageDialogData } from '../../../models/Modal/MessageDialogData';
import { MessageDialogComponent } from '../../../../shared/components/message-dialog/message-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ModalDialogService {
  private _isOpen = signal(false);
  private _type = signal<'success' | 'error'>('success');
  private _title = signal('');
  private _message = signal('');

  readonly isOpen = computed(() => this._isOpen());
  readonly type = computed(() => this._type());
  readonly title = computed(() => this._title());
  readonly message = computed(() => this._message());

  open(type: 'success' | 'error', title: string, message: string) {
    this._type.set(type);
    this._title.set(title);
    this._message.set(message);
    this._isOpen.set(true);
  }

  close() {
    this._isOpen.set(false);
  }
}

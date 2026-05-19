import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WarningService {
  private _isOpen = signal(false);
  private _title = signal('');
  private _message = signal('');
  private _confirmText = signal('Sí, continuar');
  private _cancelText = signal('Cancelar');
  private _onConfirm = signal<() => void>(() => {});
  private _onCancel = signal<() => void>(() => {});

  readonly isOpen = computed(() => this._isOpen());
  readonly title = computed(() => this._title());
  readonly message = computed(() => this._message());
  readonly confirmText = computed(() => this._confirmText());
  readonly cancelText = computed(() => this._cancelText());

  open(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel: () => void = () => {},
    confirmText = 'Sí, continuar',
    cancelText = 'Cancelar'
  ) {
    this._title.set(title);
    this._message.set(message);
    this._confirmText.set(confirmText);
    this._cancelText.set(cancelText);
    this._onConfirm.set(onConfirm);
    this._onCancel.set(onCancel);
    this._isOpen.set(true);
  }

  confirm() {
    this._onConfirm()();
    this.close();
  }

  cancel() {
    this._onCancel()();
    this.close();
  }

  close() {
    this._isOpen.set(false);
  }
}

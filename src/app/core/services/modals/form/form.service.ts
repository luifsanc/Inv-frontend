import { computed, Injectable, signal, Type } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private _isOpen = signal(false);
  private _modalTitle = signal('');
  private _modalIcon = signal('');
  private _modalContent = signal<Type<unknown> | null>(null);
  private _modalData = signal<any>(null);
  private _successMessage = signal<string | null>(null);
  private _onSuccessCallback: ((message: string) => void) | null = null;

  private _onCloseCallback: ((result?: any) => void) | null = null;
  private _onErrorCallback: ((error: any) => void) | null = null;

  readonly isOpen = computed(() => this._isOpen());
  readonly modalTitle = computed(() => this._modalTitle());
  readonly modalIcon = computed(() => this._modalIcon());
  readonly modalContent = computed(() => this._modalContent());
  readonly modalData = computed(() => this._modalData());
  readonly successMessage = computed(() => this._successMessage());

  open(
    title: string,
    icon: string,
    content: Type<unknown>,
    data?: any,
    onClose?: (result?: any) => void,
    onError?: (error: any) => void
  ) {
    this._modalTitle.set(title);
    this._modalIcon.set(icon);
    this._modalContent.set(content);
    this._modalData.set(data || null);
    this._onCloseCallback = onClose || null;
    this._onErrorCallback = onError || null;
    this._isOpen.set(true);
  }

  get modalDataValue() {
    return this._modalData();
  }

  close(result?: any) {
    this._isOpen.set(false);
    this._modalContent.set(null);

    if (this._onCloseCallback) {
      this._onCloseCallback(result);
      this._onCloseCallback = null;
    }
    this._onErrorCallback = null;
  }

  error(error: any) {
    this._isOpen.set(false);
    this._modalContent.set(null);

    if (this._onErrorCallback) {
      this._onErrorCallback(error);
      this._onErrorCallback = null;
    }
    this._onCloseCallback = null;
  }

  success(message: string) {
    this._successMessage.set(message);
    if (this._onSuccessCallback) {
      this._onSuccessCallback(message);
      this._onSuccessCallback = null;
    }
    this._onCloseCallback = null;
  }
}

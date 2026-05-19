import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 @param countryControl Función que devuelve el valor actual del país.
 */

export function rucValidator(countryControl: () => string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const ruc = control.value;
    const country = countryControl();

    if (!ruc) return null;

    // Validación para Ecuador
    if (country === '5') {
      const regexEcuador = /^\d{10}001$/; // 13 dígitos, termina en 001
      return regexEcuador.test(ruc)
        ? null
        : { rucInvalido: 'El RUC de Ecuador debe tener 13 dígitos y terminar en 001' };
    }

    // Validación para cualquier otro país
    const regexGeneral = /^[A-Za-z0-9]{8,15}$/;
    return regexGeneral.test(ruc)
      ? null
      : { rucInvalido: 'El RUC/NIT debe tener entre 8 y 15 caracteres alfanuméricos' };
  };
}

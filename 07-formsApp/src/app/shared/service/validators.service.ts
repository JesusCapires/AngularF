import { Injectable } from '@angular/core';
import { FormControl, ValidationErrors, FormGroup, AbstractControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ValidatorsService {

  //EXPRESIONES REGULARES A USAR EN LA VALIDACIÓN DEL NOMBRE Y DEL EMAIL
  public firstNameAndLastnamePattern: string = '([a-zA-Z]+) ([a-zA-Z]+)';
  public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  //DEFINICIÓN DE FUNCIÓN QUE TOMA 1 PARAMETRO Y DEVUELVE UN OBSERVABLE O NULL
  public cantBeStrider = ( control: FormControl ): ValidationErrors | null => {
    //OBTIENE VALOR, ELIMINA ESPACIOS EN BLANCO, CONVIERTE LA CADENA A MINUSCULAS
    const value: string = control.value.trim().toLowerCase();

    if (value === 'strider') {
      return {
        noStrider: true,
      }
    }

    return null;
  }

  public isValidField( form: FormGroup, field: string ) {
    return form.controls[field].errors && form.controls[field].touched;
  }

//DEFINICIÓN DE LA FUNCIÓN PÚBLICA. TOMA 2 PARAMETROS (CAMPOS A IGUALAR)
  public isFieldOneEqualFieldTwo( field1: string, field2: string ) {
//LA FUNCIÓN DEVUELVE UNA FUNCIÓN QUE TOMA 1 PARAMETRO QUE ES EL FORMULARIO.
    return ( formGroup: AbstractControl ): ValidationErrors | null => {

      //OBTENCIÓN DEL VALOR DE CADA CAMPO RECIBIDO
      const fieldValue1 = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;
      //SI LOS CAMPOS SON DIFERENTES
      if ( fieldValue1 !== fieldValue2 ) {
        formGroup.get(field2)?.setErrors({ notEqual: true });
        return { notEqual: true }
      }
      //SI LOS CAMPOS SON IGUALES
      formGroup.get(field2)?.setErrors(null);
      return null;
    }

  }


}

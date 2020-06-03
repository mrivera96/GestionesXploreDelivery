import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function PasswordValidate(controlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    let password = control.value;
    const uppercaseRegex = new RegExp("(?=.*[A-Z])"); //has at least one upper case letter
    const numRegex = new RegExp("(?=.*\\d)"); // has at least one number
    const specialcharRegex = new RegExp("[!@#$%^&*(),.?\":{}|<>]");

    if (!uppercaseRegex.test(password)) {
      if (control.errors && !control.errors.mustCapital) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      control.setErrors({ mustCapital: true });
    }else if (!numRegex.test(password)) {
      if (control.errors && !control.errors.mustNum) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      control.setErrors({ mustNum: true });
    } else if (!specialcharRegex.test(password)) {
      if (control.errors && !control.errors.mustSpecial) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      control.setErrors({ mustSpecial: true });
    }else {
      control.setErrors(null);
    }
  }
}

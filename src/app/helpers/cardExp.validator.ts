import { FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Schedule } from '../models/schedule';

export function CardExpirationValidate(controlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const date = control.value;
    const currentDate = formatDate(new Date(), 'M/yy', 'en').split('/');
    const month = date?.substr(0,2);
    const year = date?.substr(2,2);
      
    if (control.errors && !control.errors.mustAfterDate) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    if(year < currentDate[1]){
        control.setErrors({ mustAfterDate: true });
    }else if(year == currentDate[1] && month < currentDate[0]){
        control.setErrors({ mustAfterDate: true });
    }

    
  };
}

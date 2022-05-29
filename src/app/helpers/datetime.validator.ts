import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeliveriesService } from '../services/deliveries.service';
export class DateTimeValidate {
  static createValidator(
    deliveriesService: DeliveriesService,
    date: string,
    delType: boolean
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return deliveriesService
        .validateDateTime(date, control.value, delType)
        .pipe(
          map((response: any) =>
            response.result ? { mustAfterHour: true } : null
          )
        );
    };
  }
}

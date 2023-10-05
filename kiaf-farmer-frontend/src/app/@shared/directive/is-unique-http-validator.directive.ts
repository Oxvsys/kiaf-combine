import { HttpClient } from "@angular/common/http";
import { Directive, Input } from "@angular/core";
import { NG_ASYNC_VALIDATORS, AsyncValidator, AbstractControl, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Directive({
    selector: '[isUniqueHttpValidator][ngModel],[isUniqueHttpValidator][FormControl],[isUniqueHttpValidator][[formControlName]]',
    providers: [
        { provide: NG_ASYNC_VALIDATORS, useExisting: IsUniqueHttpValidator, multi: true }
    ]
})
export class IsUniqueHttpValidator implements AsyncValidator {

    constructor(private http: HttpClient,) {
    }
    @Input()
    isUniqueHttpValidator = ''; // Pass Url to check unique field

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        const url = environment.apiUrl;
        const obs = this.http.post<boolean>(url + this.isUniqueHttpValidator, { field: control.value })
            .pipe(
                map((isUsed) => {
                    // null no error, object for error
                    return !isUsed ? null : {
                        isUniqueHttpValidator: 'Name exists already.'
                    };
                })
            );
        return obs;
    }
}
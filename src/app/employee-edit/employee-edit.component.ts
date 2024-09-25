import { Component, Inject, OnInit, inject , ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { error } from 'console';
import { AppComponent } from '../app.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { FormControl, Validators,FormGroup } from '@angular/forms';

import { AbstractControl, ValidationErrors } from '@angular/forms';



function pastDateValidator(control: AbstractControl): ValidationErrors | null {
  const today = new Date();
  const selectedDate = new Date(control.value);

  if (selectedDate > today) {
    return { pastDate: true };
  }

  return null;
}


function PackageValidator(control: AbstractControl): ValidationErrors | null {
  const packageValue = parseInt(control.value, 10);

  if (isNaN(packageValue) || packageValue <= 10000) {
    return { minPackage: true };
  }

  return null;
}



@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss'
})
export class EmployeeEditComponent implements OnInit {
  

  
  empForm: FormGroup;
  education: string[] = [
    'Matric',
    'Diploma',
    'Graduate',
    'Post Graduate',
  ];

  
  constructor(private _fb: FormBuilder,
    private _empservice : EmployeeService, 
    private _dialogRef: MatDialogRef<EmployeeEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any
    ){
    this.empForm = this._fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      dob: ['', [Validators.required, pastDateValidator]], 
      gender:['', [Validators.required]],
      education: '',
      company: '',
      experience: ['', [Validators.required]],
      package: ['', [Validators.required, PackageValidator]],
    });
  }

  ngOnInit(): void {
    
    this.empForm.patchValue(this.data)
  }

  onFormSubmit(){
    if (this.empForm.valid){
      if(this.data){
        this._empservice.updateEmployee(this.data.id, this.empForm.value).subscribe({
          next: (val: any) => {
            alert("Employee updated ");
            this._dialogRef.close(true);
          },
          error: (err: any)=>{
            console.log(err)
  
          }
      });

      }
      else{

        this._empservice.addEmployee(this.empForm.value).subscribe({
          next: (val: any) => {
            alert("Employee Added succesfully");
            this._dialogRef.close(true);
          },
          error: (err: any)=>{
            console.log(err)
  
          }
      });

      }
     
    }

  }

  
  


}

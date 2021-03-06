import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { mimeType } from './mime-type.validator';

import { NgbDatepickerConfig, NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


// import { ElderInfo } from './Data/elders-info';
// import { CaregiverInfo } from './Data/caregiver-info';

import { SearchService } from '../services/search.service';
import { Elder } from '../models/elder.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl;


@Component({
  selector: 'app-elders-signup',
  templateUrl: './elders-signup.component.html',
  styleUrls: ['./elders-signup.component.css']
})
export class EldersSignupComponent implements OnInit {
  isLoading = false;

  validForm: boolean = null;
  elder: Elder;
  elderId: string;
  // form: FormGroup;
  private mode = '';

  // form = new FormGroup({
  //   name: new FormControl(''),
  //   password = new FormControl(''),
  //   email: new FormControl(''),
  //   birthDate: new FormControl(''),
  //   gender: new FormControl(''),
  //   houseNumber: new FormControl(''),
  //   street: new FormControl(''),
  //   subDistrict: new FormControl(''),
  //   district: new FormControl(''),
  //   province: new FormControl(''),
  //   postalCode: new FormControl(''),
  //   phoneNumber: new FormControl(''),
  // })
  name = new FormControl(null);
  // password = new FormControl(null);
  // email = new FormControl(null);
  birthDate = new FormControl(null);
  tsDate: Date;
  gender = new FormControl('');
  houseNumber = new FormControl(null);
  street = new FormControl(null);
  subDistrict = new FormControl(null);
  district = new FormControl(null);
  province = new FormControl(null);
  postalCode = new FormControl(null);
  phoneNumber = new FormControl(null);
  image = new FormControl(null);
  // imagePath = new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]});

  imagePreview: string;

  query: any;
  email: string;

  imageFile: any;


  // constructor(public searchService: SearchService, public route: ActivatedRoute, private router: Router) { }

  constructor(
    public searchService: SearchService, public route: ActivatedRoute, private router: Router, private http: HttpClient,
    config: NgbDatepickerConfig, calendar: NgbCalendar
  ) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = { year: 2020, month: 1, day: 31 };
  }

  ngOnInit() {

    // get query params
    this.route.queryParamMap.subscribe(params => {
      this.query = { ...params.keys, ...params };
    });

    this.mode = this.query.params.mode;
    console.log(this.mode);
    this.name.setValue(this.query.params.name);
    console.log(this.query);
    console.log(this.name.value);

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('elderEmail')) {
        this.email = paramMap.get('elderEmail');
      }
    });
    console.log(this.email);

    if (this.mode === 'update') {
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('elderEmail')) {
          this.email = paramMap.get('elderEmail');
          this.searchService.getElder(this.email).subscribe((Data) => {
            console.log(this.email);
            console.log(Data);
            this.elder = {
              _id: Data._id,
              name: Data.name,
              email: Data.email,
              birthDate: Data.birthDate,
              gender: Data.gender,
              houseNumber: Data.houseNumber,
              street: Data.street,
              subDistrict: Data.subDistrict,
              district: Data.district,
              province: Data.province,
              postalCode: Data.postalCode,
              phoneNumber: Data.phoneNumber,
              imagePath: Data.imagePath
            };
            const newDate = new Date(this.elder.birthDate);
            // this.birthDate.setValue({
            //   year: newDate.getFullYear(),
            //   month: newDate.getMonth() + 1,
            //   day: newDate.getDate()
            // });
            this.birthDate.setValue(newDate);
            this.gender.setValue(this.elder.gender);
            this.houseNumber.setValue(this.elder.houseNumber);
            this.street.setValue(this.elder.street);
            this.subDistrict.setValue(this.elder.subDistrict);
            this.district.setValue(this.elder.district);
            this.province.setValue(this.elder.province);
            this.postalCode.setValue(this.elder.postalCode);
            this.phoneNumber.setValue(this.elder.phoneNumber);
            this.image.setValue(this.elder.imagePath);
          });
        }
      });
    }
    //   this.route.paramMap.subscribe((paramMap: ParamMap) => {
    //     if (paramMap.has("elderEmail")) {
    //       this.mode = "edit";
    //       this.elderId = paramMap.get("elderEmail");
    //       this.searchService.getElder(this.elderId).subscribe((Data: Elder) => {
    //         this.elder = {
    //           _id: Data._id,
    //           name: Data.name,
    //           email: Data.email,
    //           password: Data.password,
    //           birthDate: Data.birthDate,
    //           gender: Data.gender,
    //           houseNumber: Data.houseNumber,
    //           street: Data.street,
    //           subDistrict: Data.subDistrict,
    //           district: Data.district,
    //           province: Data.province,
    //           postalCode: Data.postalCode,
    //           phoneNumber: Data.phoneNumber,
    //           imagePath: Data.imagePath
    //         };
    //         this.name.setValue(this.elder.name);
    //         this.birthDate.setValue(this.elder.birthDate);
    //         this.gender.setValue(this.elder.gender);
    //         this.houseNumber.setValue(this.elder.houseNumber);
    //         this.street.setValue(this.elder.street);
    //         this.subDistrict.setValue(this.elder.subDistrict);
    //         this.district.setValue(this.elder.district);
    //         this.province.setValue(this.elder.province);
    //         this.postalCode.setValue(this.elder.postalCode);
    //         this.phoneNumber.setValue(this.elder.phoneNumber);
    //         this.image.setValue(this.image);
    //       });
    //       // this.form.setValue({
    //         // email: this.elder.email,
    //         // name: this.elder.name,
    //         // birthDate: this.elder.birthDate,
    //         // gender: this.elder.gender,
    //         // houseNumber: this.elder.houseNumber,
    //         // street: this.elder.street,
    //         // subDistrict: this.elder.subDistrict,
    //         // district: this.elder.district,
    //         // province: this.elder.province,
    //         // postalCode: this.elder.postalCode,
    //         // phoneNumber: this.elder.phoneNumber
    //       // })
    //     } else {
    //       this.mode = "create";
    //       this.elderId = null;
    //     }
    //   });
    //   console.log(this.mode)
  }

  // show() {
  //   this.date = new Date(this.ngDate.year, this.ngDate.month - 1, this.ngDate.day);
  //   console.log(this.date);
  //   this.birthDate.setValue(this.date.toString());
  //   console.log(this.birthDate.value);

  // }

  onImagePicked(event) {
    // const file = (event.target as HTMLInputElement).files[0];
    const file = event.target.files[0];
    this.imageFile = file;
    this.image.patchValue({ image: file });
    this.image.updateValueAndValidity();
    console.log(file);
    console.log(this.image);

    const Data = new FormData();
    Data.append('email', this.email);
    Data.append('upload', file);
    if (this.mode === 'add') {
      this.http.post(BACKEND_URL + 'upload', Data).subscribe((res) => { });
      console.log('post image ran for ' + this.email);
    } else {
      this.http.patch(BACKEND_URL + 'upload/' + this.email, Data).subscribe((res) => { });
      console.log('update image ran for ' + this.email);
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    console.log(this.image.valid);
  }

  goBack() {
    this.router.navigate(['/elder-profile']);
  }

  // onSaveElder(form: NgForm) {
  onSaveElder() {
    // if (form.invalid) {
    //   this.validForm = false;
    //   console.log(this.validForm);
    // } else {
      console.log(this.validForm);
      if (this.mode === 'add') {
        this.tsDate = new Date(this.birthDate.value);
        this.searchService
          .addElder(
            // this.form.value.name,
            // this.form.value.email,
            // this.form.value.password,
            // this.form.value.birthdate,
            // this.form.value.gender,
            // this.form.value.houseNumber,
            // this.form.value.street,
            // this.form.value.subDistrict,
            // this.form.value.district,
            // this.form.value.province,
            // this.form.value.postalCode,
            // this.form.value.phoneNumber
            this.name.value,
            this.email,
            // this.birthDate.value,
            this.tsDate,
            this.gender.value,
            this.houseNumber.value,
            this.street.value,
            this.subDistrict.value,
            this.district.value,
            this.province.value,
            this.postalCode.value,
            this.phoneNumber.value,
            this.image.value
          );

        console.log('added');
        this.router.navigate(['/elder-home']);
      } else {
        this.tsDate = new Date(this.birthDate.value);
        console.log(this.tsDate);
        console.log('Running Update');
        this.searchService
          .UpdateElder(
            this.elder._id,
            this.name.value,
            this.email,
            // this.birthDate.value,
            this.tsDate,
            this.gender.value,
            this.houseNumber.value,
            this.street.value,
            this.subDistrict.value,
            this.district.value,
            this.province.value,
            this.postalCode.value,
            this.phoneNumber.value,
            this.image.value
          );
        console.log('updated');
        this.isLoading = true;
        setTimeout(() => {
          this.router.navigate(['/elder-profile']);
        }, 2000);
      }
    // }
  }
}

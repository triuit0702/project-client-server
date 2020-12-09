import {Component} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";
import {PasswordValidation} from "../../forms/validationforms/password-validator.component";
import {NguoiDungCTDTO} from "../../model/NguoiDungCTDTO.modet";
import * as moment from "moment";
import {DDMMYYYY} from "../../const/app.const";
import {NguoiDungService} from "./nguoi-dung.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";



export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector:'app-nguoi-dung-update',
    templateUrl:'./nguoi-dung-update.component.html',
    styleUrls:['./nguoi-dung-update.component.css']
})
export class NguoiDungUpdateComponent{

    emailFormControl = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);

    validEmailRegister: boolean = false;
    validConfirmPasswordRegister: boolean = false;
    validPasswordRegister: boolean = false;

    validEmailLogin: boolean = false;
    validPasswordLogin: boolean = false;

    validTextType: boolean = false;
    validEmailType: boolean = false;
    validNumberType: boolean = false;
    validUrlType: boolean = false;
    pattern = "https?://.+";
    validSourceType: boolean = false;
    validDestinationType: boolean = false;

    matcher = new MyErrorStateMatcher();
    register : FormGroup;
    login : FormGroup;
    type : FormGroup;
    startDate:Date = new Date(1990, 1, 1);
    nguoiDungDTO:NguoiDungCTDTO;


    constructor(private formBuilder: FormBuilder,
                private nguoiDungService:NguoiDungService,
                private activateRouter:ActivatedRoute,
                private router:Router,
                private toarService:ToastrService) {}

    isFieldValid(form: FormGroup, field: string) {
        return !form.get(field).valid && form.get(field).touched;
    }

    displayFieldCss(form: FormGroup, field: string) {
        return {
            'has-error': this.isFieldValid(form, field),
            'has-feedback': this.isFieldValid(form, field)
        };
    }

    onRegister() {
        if (this.register.valid) {
        } else {
            this.validateAllFormFields(this.register);
        }
    }
    onLogin() {
        if (this.login.valid) {
        } else {
            this.validateAllFormFields(this.login);
        }
    }
    onType() {
        //nếu không có lỗi thì gọi vào
        if (this.type.valid) {
            // console.log("aaaaaaa");
            // console.log(this.type);
            this.nguoiDungDTO=this.type.value;
            this.nguoiDungDTO.ngaySinh=moment(this.nguoiDungDTO.ngaySinhDate);
            this.nguoiDungDTO.nngaySinhFormat=moment(this.nguoiDungDTO.ngaySinh).format(DDMMYYYY);

            this.nguoiDungService.saveUser(this.nguoiDungDTO).subscribe(
                response=>{
                    this.toarService.success("Lưu thành công")
                    this.resetForm();
                },
                error => {
                    this.toarService.error("Lưu thất bại")
            });

        } else {
            this.validateAllFormFields(this.type);
        }
    }
    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }
    ngOnInit() {
        this.type = this.formBuilder.group({
            // To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
            // text: [null, Validators.required],
            userId:null,
            userDetailId:null,
            userName: [null, Validators.required],
            diaChi: [null, Validators.required],
            hoTen: [null, Validators.required],
            sdt: [null, Validators.required],
            taiKhoan: [null, Validators.required],
            ngaySinhDate:[new Date(1990,0,1)],
            gioiTinh:['true'],
            email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
            // number: [null, Validators.required],
            // url: [null , Validators.required],
            // We can use more than one validator per field. If we want to use more than one validator we have to wrap our array of validators with a Validators.compose function. Here we are using a required, minimum length and maximum length validator.
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
        }, {
            validator: PasswordValidation.MatchPassword // your validation method
        });

        this.activateRouter.data.subscribe(data=>{
            this.nguoiDungDTO=data['nguoiDungDTO'];
            console.log(this.nguoiDungDTO);
            if(this.nguoiDungDTO){
                this.type.setValue({
                    // To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
                    // text: [null, Validators.required],
                    userId:this.nguoiDungDTO.userId,
                    userDetailId:this.nguoiDungDTO.userDetailId,
                    userName: this.nguoiDungDTO.userName,
                    diaChi: this.nguoiDungDTO.diaChi,
                    hoTen: this.nguoiDungDTO.hoTen,
                    sdt: this.nguoiDungDTO.sdt,
                    taiKhoan: this.nguoiDungDTO.taiKhoan,
                    ngaySinhDate:this.nguoiDungDTO.ngaySinh,
                    gioiTinh:this.nguoiDungDTO.gioiTinh+'',
                    email: this.nguoiDungDTO.email,
                    // number: [null, Validators.required],
                    // url: [null , Validators.required],
                    // We can use more than one validator per field. If we want to use more than one validator we have to wrap our array of validators with a Validators.compose function. Here we are using a required, minimum length and maximum length validator.
                    password: this.nguoiDungDTO.password,
                    confirmPassword: this.nguoiDungDTO.password
                })
            }}
        )


        // this.register = this.formBuilder.group({
        //     // To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
        //     email: [null, [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        //     // We can use more than one validator per field. If we want to use more than one validator we have to wrap our array of validators with a Validators.compose function. Here we are using a required, minimum length and maximum length validator.
        //     optionsCheckboxes: ['', Validators.required],
        //     password: ['',  Validators.compose([Validators.required, Validators.minLength(6)])],
        //     confirmPassword: ['', Validators.required],
        //     text: [null, Validators.required],
        // }, {
        //     validator: PasswordValidation.MatchPassword // your validation method
        // });
        // this.login = this.formBuilder.group({
        //     // To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
        //     email: [null, [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        //     // We can use more than one validator per field. If we want to use more than one validator we have to wrap our array of validators with a Validators.compose function. Here we are using a required, minimum length and maximum length validator.
        //     password: ['', Validators.required]
        // });
        // this.type = this.formBuilder.group({
        //     // To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
        //     // text: [null, Validators.required],
        //
        //     userName: [null, Validators.required],
        //     diaChi: [null, Validators.required],
        //     hoTen: [null, Validators.required],
        //     sdt: [null, Validators.required],
        //     taiKhoan: [null, Validators.required],
        //     ngaySinhDate:[new Date(1990,0,1)],
        //     gioiTinh:['true'],
        //     email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        //     // number: [null, Validators.required],
        //     // url: [null , Validators.required],
        //     // We can use more than one validator per field. If we want to use more than one validator we have to wrap our array of validators with a Validators.compose function. Here we are using a required, minimum length and maximum length validator.
        //     password: ['', Validators.required],
        //     confirmPassword: ['', Validators.required],
        // }, {
        //     validator: PasswordValidation.MatchPassword // your validation method
        // });


    }

    emailValidationRegister(e){
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(String(e).toLowerCase())) {
            this.validEmailRegister = true;
        } else {
            this.validEmailRegister = false;
        }
    }
    passwordValidationRegister(e){
        if(e){
            if (e.length > 5) {
                this.validPasswordRegister = true;
            }else{
                this.validPasswordRegister = false;
            }
        }

    }
    confirmPasswordValidationRegister(e){
        if(e){
            if (this.type.controls['password'].value === e) {
                this.validConfirmPasswordRegister = true;
            }else{
                this.validConfirmPasswordRegister = false;
            }
        }

    }

    emailValidationLogin(e){
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(String(e).toLowerCase())) {
            this.validEmailLogin= true;
        } else {
            this.validEmailLogin = false;
        }
    }
    passwordValidationLogin(e){
        if (e.length > 5) {
            this.validPasswordLogin = true;
        }else{
            this.validPasswordLogin = false;
        }
    }


    textValidationType(e){
        if (e) {
            this.validTextType = true;
        }else{
            this.validTextType = false;
        }
    }
    emailValidationType(e){
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(String(e).toLowerCase())) {
            this.validEmailType = true;
        } else {
            this.validEmailType = false;
        }
    }
    numberValidationType(e){
        if (e) {
            this.validNumberType = true;
        }else{
            this.validNumberType = false;
        }
    }
    urlValidationType(e){
        try {
            new URL(e);
            this.validUrlType = true;
        } catch (_) {
            this.validUrlType = false;
        }
    }
    sourceValidationType(e){
        if (e) {
            this.validSourceType = true;
        }else{
            this.validSourceType = false;
        }
    }
    confirmDestinationValidationType(e){
        if (this.type.controls['password'].value === e) {
            this.validDestinationType = true;
        }else{
            this.validDestinationType = false;
        }
    }

    back() {
        this.router.navigate(['quanlynguoidung/nguoidung']);
    }


    resetForm(){


        this.type.setValue({
            // To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
            // text: [null, Validators.required],
            userId:null,
            userDetailId:null,
            userName: null,
            diaChi: null,
            hoTen: null,
            sdt: null,
            taiKhoan:null,
            ngaySinhDate:new Date(1990,0,1),
            gioiTinh:'true',
            email: null,
            password:null,
            confirmPassword: null
        });
    }
}
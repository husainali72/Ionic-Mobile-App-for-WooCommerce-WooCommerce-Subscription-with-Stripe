import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { BillingPage } from "../billing/billing";
import { MessagePage } from "../message/message";
//import { ProvidersWoocommerceProvider } from "../../providers/providers-woocommerce/providers-woocommerce";
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { PasswordValidator } from './password.validator';
import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef } from "@angular/core";

/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-checkout",
  templateUrl: "checkout.html"
})

export class CheckoutPage {
  //WooCommerce: any;
  product: any;
  discount: any;

  validations_form: FormGroup;
  matching_passwords_group: FormGroup;
  contact_group: FormGroup;
  stateList: any[];
  defaultCountry: String;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    /* private WP: ProvidersWoocommerceProvider, */ public formBuilder: FormBuilder,
    public http: HttpClient, private ref: ChangeDetectorRef,
  ) {
    //this.WooCommerce = this.WP.init();
    this.product = this.navParams.get("product");
    this.discount = this.navParams.get("discount");
  }

  ngOnInit() {
    var stateResult = { "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District Of Columbia", "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming", "AA": "Armed Forces (AA)", "AE": "Armed Forces (AE)", "AP": "Armed Forces (AP)" };
    var stateList = [];
    for (var i in stateResult) {
      stateList.push({
        id: i,
        name: stateResult[i]
      });
    }
    this.stateList = stateList;
    this.defaultCountry = 'US';
  }

  ionViewWillLoad() {

    this.contact_group = new FormGroup({
      addressLine1: new FormControl('', Validators.required),
      country: new FormControl({ value: 'United States (US)', disabled: true }, Validators.required),
      state: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      zipCode: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{5,10}$')
      ]),
      phone: new FormControl('', [
        Validators.minLength(10),
        Validators.pattern('^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$')
      ])
    });

    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', [Validators.minLength(8), Validators.required]),
      cpassword: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });

    this.validations_form = this.formBuilder.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
      ])),
      dob: new FormControl('', Validators.required),
      gender: new FormControl('Male', Validators.required),
      language: new FormControl('English', Validators.required),
      country_phone: this.contact_group,
      matching_passwords: this.matching_passwords_group,
    });
  }

  validation_messages = {
    'firstname': [
      { type: 'required', message: 'Name is required.' },
      { type: 'minlength', message: 'First name must be at least 4 characters long.' },
    ],
    'lastname': [
      { type: 'required', message: 'Last name is required.' },
      { type: 'minlength', message: 'Last name must be at least 2 characters long.' },
    ],
    'dob': [
      { type: 'required', message: 'Date of Birth is required.' },
    ],
    'gender': [
      { type: 'required', message: 'Gender is required.' },
    ],
    'language': [
      { type: 'required', message: 'Language is required.' },
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'phone': [
      { type: 'pattern', message: 'Invalid Phone entered.' },
      { type: 'minlength', message: 'Phone must be at least 10 characters long.' },
    ],
    'addressLine1': [
      { type: 'required', message: 'Address is required.' },
    ],
    'country': [
      { type: 'required', message: 'Country is required.' },
    ],
    'state': [
      { type: 'required', message: 'State is required.' },
    ],
    'city': [
      { type: 'required', message: 'City is required.' },
    ],
    'zipCode': [
      { type: 'required', message: 'Zipcode is required.' },
      { type: 'pattern', message: 'Invalid Zipcode.' },
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 8 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
    'cpassword': [
      { type: 'required', message: 'Confirm password is required' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'Password mismatch' }
    ],
  }

  onSubmit() {
    if (this.validations_form.valid) {
      var custInfo = {
        firstName: this.validations_form.value.firstName,
        lastName: this.validations_form.value.lastName,
        email: this.validations_form.value.email,
        phone: this.validations_form.value.country_phone.phone,
        addressLine1: this.validations_form.value.country_phone.addressLine1,
        city: this.validations_form.value.country_phone.city,
        zipCode: this.validations_form.value.country_phone.zipCode,
        state: this.validations_form.value.country_phone.state,
        country: this.defaultCountry,
        dob: this.validations_form.value.dob,
        gender: this.validations_form.value.gender,
        language: this.validations_form.value.language,
        password: this.validations_form.value.matching_passwords.password,
      }
      this.navCtrl.push(BillingPage, { "product": this.product, "customer": custInfo, "discount": this.discount });
    } else {
      Object.keys(this.validations_form.controls)
        .forEach(field => {
          const control = this.validations_form.get(field);
          control.markAsTouched({ onlySelf: true });
        });
      Object.keys(this.contact_group.controls)
        .forEach(field => {
          const control = this.contact_group.get(field);
          control.markAsTouched({ onlySelf: true });
        });
      Object.keys(this.matching_passwords_group.controls)
        .forEach(field => {
          const control = this.matching_passwords_group.get(field);
          control.markAsTouched({ onlySelf: true });
        });
      this.reflectChanges();
    }
  }

  reflectChanges() {
    this.ref.detectChanges();
  }


  message() {
    this.navCtrl.push(MessagePage);
  }
}

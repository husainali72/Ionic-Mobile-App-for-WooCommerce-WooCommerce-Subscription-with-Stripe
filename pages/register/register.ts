import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CartPage } from "../cart/cart";
import { MessagePage } from "../message/message";
//import { ThankyouPage } from "../thankyou/thankyou";
import { ProvidersWoocommerce } from "../../providers/providers-woocommerce/providers-woocommerce";
import { ChangeDetectorRef } from "@angular/core";
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage {
  WooCommerce: any;
  products: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private WP: ProvidersWoocommerce,
    private ref: ChangeDetectorRef,
    public loadingCtrl: LoadingController
  ) {
    this.WooCommerce = this.WP.init(true);
    this.products = [];
  }

  ngOnInit() { 
    this.getProducts();
  }

  getProducts() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    /* this.WooCommerce.getAsync("subscriptions/5692/orders",
      (err, data, res) => {
        if (err || data.statusCode != 200) {
          return;
        }
      }); */

    this.WooCommerce.getAsync("products?type=subscription&status=publish&filter[meta]=true").then(
      data => {
        this.products = JSON.parse(data.body);
        for (var i = 0; i < this.products.length; i++) {
          for (var m = 0; m < this.products[i].meta_data.length; m++) {
            if (this.products[i].meta_data[m].key == '_subscription_period') {
              this.products[i].intervalType = this.products[i].meta_data[m].value;
            }
            if (this.products[i].meta_data[m].key == '_subscription_sign_up_fee') {
              this.products[i].signUpFee = this.products[i].meta_data[m].value;
            }
          }

          if (this.products[i].signUpFee) {
            this.products[i].total_fee = parseFloat(this.products[i].regular_price) + parseFloat(this.products[i].signUpFee);
          } else {
            this.products[i].total_fee = parseFloat(this.products[i].regular_price);
          }
        }

        this.ref.detectChanges();
        loading.dismiss();
      },
      err => {
        console.log(err);
      }
    );
  }

  ionViewDidLoad() {

  }

  /* goThankyou() {
    this.navCtrl.setRoot(ThankyouPage, {
      message: {
        title: 'Thank you',
        body: 'Your subscription has been registered successfully. Your subscription has been registered successfully.',
        type: 'error'
      }
    });
  } */

  cart(product) {
    this.navCtrl.push(CartPage, { "product": product });
  }
  message() {
    this.navCtrl.push(MessagePage);
  }
}

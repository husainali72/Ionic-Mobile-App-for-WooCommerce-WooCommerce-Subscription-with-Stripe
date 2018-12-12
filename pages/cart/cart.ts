import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CheckoutPage } from '../checkout/checkout';
import { MessagePage } from "../message/message";
import { ProvidersWoocommerce } from "../../providers/providers-woocommerce/providers-woocommerce";
import { HttpClient } from "@angular/common/http";
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ProvidersConfig } from "../../providers/providers-config"

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  WooCommerce: any;

  product: any;
  couponCode: String;
  appliedCode: String;
  appliedCodeId: number;
  discountAmount: number;
  recDiscountAmount: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private WP: ProvidersWoocommerce, public http: HttpClient, public config: ProvidersConfig,
    public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.product = this.navParams.get("product");
    this.WooCommerce = this.WP.init(true);
    this.couponCode = "";
    this.appliedCode = "";
    this.discountAmount = 0;
    this.appliedCodeId = 0;
    this.recDiscountAmount = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
  }

  checkout() {
    this.product.billingAmount = parseFloat(this.product.total_fee) - parseFloat(this.discountAmount.toString());
    this.navCtrl.push(CheckoutPage, {
      "product": this.product, "discount": {
        "code": this.appliedCode,
        "amount": this.discountAmount,
        "codeId": this.appliedCodeId,
        "recAmount": this.recDiscountAmount
      }
    });
  }

  message() {
    this.navCtrl.push(MessagePage);
  }

  removeCode() {
    this.appliedCode = "";
    this.couponCode = "";
    this.discountAmount = 0;
    this.appliedCodeId = 0;
  }

  verifyCouponCode() {
    let loadingProcessing = this.loadingCtrl.create({
      content: 'Verifying Coupon Code...'
    });

    loadingProcessing.present();

    this.http.post(this.config.getCustomApiBase() + "fetch-coupon", {
      code: this.couponCode,
      product_id: this.product.id,
    }
    ).subscribe(data => {
      loadingProcessing.dismiss();
      let toastCouponCode = this.toastCtrl.create({
        message: data['message'],
        duration: 3000,
        position: 'top'
      });

      if (data['code'] == 200) {
        this.appliedCode = data['coupon_data']["code"];
        this.appliedCodeId = data['coupon_data']["id"];
        this.discountAmount = 0;
        switch (data['coupon_data']['discount_type']) {
          case "sign_up_fee_percent": {
            this.discountAmount = this.product.signUpFee * parseFloat(data['coupon_data']["amount"]) / 100;
            break;
          }
          case "sign_up_fee": {
            if (this.product.signUpFee < parseFloat(data['coupon_data']["amount"])) {
              this.discountAmount = this.product.signUpFee;
            } else {
              this.discountAmount = parseFloat(data['coupon_data']["amount"]);
            }
            break;
          }
          case "percent": {
            this.discountAmount = this.product.total_fee * parseFloat(data['coupon_data']["amount"]) / 100;
            break;
          }
          case "recurring_fee": {
            if (this.product.regular_price < parseFloat(data['coupon_data']["amount"])) {
              this.recDiscountAmount = this.product.regular_price;
            } else {
              this.recDiscountAmount = parseFloat(data['coupon_data']["amount"]);
            }
            this.discountAmount = this.recDiscountAmount;
            break;
          }
          case "recurring_percent": {
            this.recDiscountAmount = this.product.regular_price * parseFloat(data['coupon_data']["amount"]) / 100;
            this.discountAmount = this.recDiscountAmount;
            break;
          }
          case "fixed_cart": {
            if (this.product.regular_price < parseFloat(data['coupon_data']["amount"])) {
              this.discountAmount = this.product.regular_price;
            } else {
              this.discountAmount = parseFloat(data['coupon_data']["amount"]);
            }
            break;
          }
          case "fixed_product": {
            if (this.product.regular_price < parseFloat(data['coupon_data']["amount"])) {
              this.discountAmount = this.product.regular_price;
            } else {
              this.discountAmount = parseFloat(data['coupon_data']["amount"]);
            }
            break;
          }
          default: {
            this.appliedCode = "";
            toastCouponCode = this.toastCtrl.create({
              message: "Invalid Coupon Type. Please contact to your vendor.",
              duration: 3000,
              position: 'top'
            });
          }
        }
      }
      toastCouponCode.present();
    }, err => {
      loadingProcessing.dismiss();
      var toastCouponCode = this.toastCtrl.create({
        message: err.error.message,
        duration: 3000,
        position: 'top'
      });
      toastCouponCode.present();
    });
  }

}

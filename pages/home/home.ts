import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
//import { CartPage } from "../cart/cart";
import { RegisterPage } from "../register/register";
import { MessagePage } from "../message/message";
import { ProvidersWoocommerce } from "../../providers/providers-woocommerce/providers-woocommerce";
import { LoadingController } from "ionic-angular";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  WooCommerce: any;
  products: any[];
  constructor(
    public navCtrl: NavController,
    private WP: ProvidersWoocommerce,
    public loadingCtrl: LoadingController
  ) {
    this.WooCommerce = this.WP.init(true);
    this.products = [];
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  message() {
    this.navCtrl.push(MessagePage);
  }
}

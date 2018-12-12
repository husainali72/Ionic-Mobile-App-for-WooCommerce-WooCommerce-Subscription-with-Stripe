import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { LoadingController, ToastController } from "ionic-angular";
import { MessagePage } from "../message/message";
import { ThankyouPage } from "../thankyou/thankyou";
import { ProvidersWoocommerce } from "../../providers/providers-woocommerce/providers-woocommerce";
import { HttpClient } from "@angular/common/http";
import { ProvidersConfig } from "../../providers/providers-config";
import { Keyboard } from "@ionic-native/keyboard";

/**
 * Generated class for the BillingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var Stripe;

@IonicPage()
@Component({
  selector: "page-billing",
  templateUrl: "billing.html",
  providers: [Keyboard]
})
export class BillingPage {
  stripe: any;
  card: any;
  WooCommerce: any;
  product: any;
  customer: any;
  discount: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private WP: ProvidersWoocommerce,
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public config: ProvidersConfig,
    private keyboard: Keyboard
  ) {
    this.product = this.navParams.get("product");
    this.customer = this.navParams.get("customer");
    this.discount = this.navParams.get("discount");
    this.WooCommerce = this.WP.init();
    this.stripe = Stripe(this.config.getStripeKey());
  }

  ionViewDidLoad() {
    this.setupStripe();
  }

  onWillDismiss() {}

  padLeft(strval, n = 2) {
    return Array(n - String(strval).length + 1).join("0") + strval;
  }

  getDateString(d: Date) {
    var dformat =
      [
        d.getFullYear(),
        this.padLeft(d.getMonth() + 1),
        this.padLeft(d.getDate())
      ].join("-") +
      " " +
      [
        this.padLeft(d.getHours()),
        this.padLeft(d.getMinutes()),
        this.padLeft(d.getSeconds())
      ].join(":");
    return dformat;
  }

  setupStripe() {
    let loadingRegisteringPayment = this.loadingCtrl.create({
      content: "Processing payment..."
    });

    let toastRegisteringPayment = this.toastCtrl.create({
      message: "Payment registered successfully",
      duration: 3000,
      position: "top"
    });

    let loadingProcessing = this.loadingCtrl.create({
      content: "Processing..."
    });

    let toastProcessing = this.toastCtrl.create({
      message: "Payment processed successfully",
      duration: 3000,
      position: "top"
    });

    let loadingSubscription = this.loadingCtrl.create({
      content: "Processing Subscription..."
    });

    let loadingOrderStatus = this.loadingCtrl.create({
      content: "Processing Subscription..."
    });

    let toastSubscription = this.toastCtrl.create({
      message: "Subscribed successfully",
      duration: 3000,
      position: "top"
    });

    let loadingTelemedia = this.loadingCtrl.create({
      content: "Processing Portal Registeration..."
    });

    let elements = this.stripe.elements();
    var style = {
      base: {
        color: "#32325d",
        lineHeight: "24px",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };

    this.card = elements.create("card", { style: style });

    this.card.mount("#card-element");

    this.card.addEventListener("change", event => {
      var displayError = document.getElementById("card-errors");
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = "";
      }
    });

    var form = document.getElementById("payment-form");
    form.addEventListener("submit", event => {
      event.preventDefault();
      this.keyboard.close();

      var cust_fullname =
        this.customer.firstName + " " + this.customer.lasttName;

      var ownerInfo = {
        owner: {
          name: cust_fullname,
          address: {
            city: this.customer.email,
            country: this.customer.country,
            line1: this.customer.addressLine1,
            line2: "",
            state: this.customer.state
          },
          email: this.customer.email
        }
      };

      loadingRegisteringPayment.present();

      this.stripe.createSource(this.card, ownerInfo).then(result => {
        if (result.error) {
          var errorElement = document.getElementById("card-errors");
          errorElement.textContent = result.error.message;
        } else {
          var stripe_source = result.source;
          var wp_user_id = "";
          var stripe_customer: any = {};
          loadingRegisteringPayment.dismiss();
          toastRegisteringPayment.present();
          loadingProcessing.present();

          this.http
            .post(this.config.getCustomApiBase() + "register-source-user", {
              stripe: stripe_source,
              userInfo: {
                email: this.customer.email,
                password: this.customer.password
              },
              price: this.product.billingAmount
            })
            .subscribe(
              data => {
                loadingProcessing.dismiss();
                toastProcessing.present();
                if (data["code"] == 200) {
                  loadingSubscription.present();
                  wp_user_id = data["user_id"];

                  stripe_customer = data["customer"];

                  var tempDate = new Date();
                  var startDate = this.getDateString(tempDate);
                  var endDate = "";
                  if (this.product.intervalType == "day") {
                    tempDate.setDate(tempDate.getDate() + 1);
                    endDate = this.getDateString(tempDate);
                  } else if (this.product.intervalType == "week") {
                    tempDate.setDate(tempDate.getDate() + 7);
                    endDate = this.getDateString(tempDate);
                  } else if (this.product.intervalType == "month") {
                    tempDate.setMonth(tempDate.getMonth() + 1);
                    endDate = this.getDateString(tempDate);
                  } else if (this.product.intervalType == "year") {
                    tempDate.setFullYear(tempDate.getFullYear() + 1);
                    endDate = this.getDateString(tempDate);
                  }

                  var customerBillingData = {
                    first_name: this.customer.firstName,
                    last_name: this.customer.lastName,
                    address_1: this.customer.addressLine1,
                    address_2: "",
                    city: this.customer.city,
                    state: this.customer.state,
                    postcode: this.customer.zipCode,
                    country: this.customer.country,
                    email: this.customer.email,
                    student_birth: this.customer.dob,
                    student_gender: this.customer.gender,
                    language: this.customer.language,
                    phone: this.customer.phone
                  };

                  var customerShippingData = {
                    first_name: this.customer.firstName,
                    last_name: this.customer.lastName,
                    address_1: this.customer.addressLine1,
                    address_2: "",
                    city: this.customer.city,
                    state: this.customer.state,
                    postcode: this.customer.zipCode,
                    country: this.customer.country
                  };

                  var productDetails = [
                    {
                      product_id: this.product.id,
                      quantity: 1,
                      subtotal: this.product.total_fee.toString(),
                      total: this.product.billingAmount.toString()
                    }
                  ];

                  var SubProductDetails = [
                    {
                      product_id: this.product.id,
                      quantity: 1,
                      subtotal: this.product.regular_price.toString(),
                      total: (
                        this.product.regular_price - this.discount.recAmount
                      ).toString()
                    }
                  ];

                  var couponData = {};
                  var couponRecData = {};
                  if (this.discount.code) {
                    couponData = [
                      {
                        code: this.discount.code,
                        discount: this.discount.amount.toString()
                      }
                    ];

                    if (this.discount.recAmount > 0) {
                      couponRecData = [
                        {
                          code: this.discount.code,
                          discount: this.discount.recAmount.toString()
                        }
                      ];
                    }
                  }

                  var orderData = {
                    payment_method: "stripe",
                    payment_method_title: "Stripe (Credit Card)",
                    set_paid: true,
                    billing: customerBillingData,
                    shipping: customerShippingData,
                    line_items: productDetails,
                    coupon_lines: couponData
                  };

                  this.WooCommerce.post(
                    "orders",
                    orderData,
                    (err, data, res) => {
                      if (err || data.statusCode > 250) {
                        loadingSubscription.dismiss();
                        this.navCtrl.setRoot(ThankyouPage, {
                          message: {
                            title: "Oops!",
                            body:
                              "Some error occurs while making subscription. Please try again later.",
                            type: "error"
                          }
                        });
                        return;
                      }
                      var orderDetails = JSON.parse(res);

                      var subscr_data = {
                        customer_id: wp_user_id,
                        parent_id: orderDetails.id,
                        status: "active",
                        billing_period: this.product.intervalType,
                        billing_interval: 1,
                        start_date: startDate,
                        next_payment_date: endDate,
                        payment_details: {
                          method_id: "stripe",
                          method_title: "Stripe (Credit Card)",
                          post_meta: {
                            _stripe_customer_id: stripe_customer.id,
                            _stripe_source_id: stripe_source.id
                          }
                        },
                        coupon_lines: couponRecData,
                        billing: customerBillingData,
                        shipping: customerShippingData,
                        line_items: SubProductDetails
                      };

                      this.WooCommerce.post(
                        "subscriptions",
                        subscr_data,
                        (err, data, res) => {
                          loadingSubscription.dismiss();
                          toastSubscription.present();
                          if (err || data.statusCode > 250) {
                            this.navCtrl.setRoot(ThankyouPage, {
                              message: {
                                title: "Oops!",
                                body:
                                  "Some error occurs while making subscription. Please try again later.",
                                type: "error"
                              }
                            });
                            return;
                          }

                          var subscrDetails = JSON.parse(res);
                          this.customer.subscription_id = subscrDetails["id"];

                          loadingTelemedia.present();
                          this.http
                            .post(
                              this.config.getCustomApiBase() + "telemedia",
                              this.customer
                            )
                            .subscribe(data => {
                              loadingTelemedia.dismiss();

                              if (data["code"] > 250) {
                                this.navCtrl.setRoot(ThankyouPage, {
                                  message: {
                                    title: "Oops!",
                                    body: data["message"],
                                    type: "error"
                                  }
                                });
                              }

                              var orderStatus = {
                                status: "completed"
                              };

                              loadingOrderStatus.present();
                              this.WooCommerce.put(
                                "orders/" + orderDetails.id,
                                orderStatus,
                                (err, data, res) => {
                                  loadingOrderStatus.dismiss();
                                  if (err || data.statusCode > 250) {
                                    this.navCtrl.setRoot(ThankyouPage, {
                                      message: {
                                        title: "Oops!",
                                        body:
                                          "Some error occurs while changing order status. Please contact to your vendor.",
                                        type: "error"
                                      }
                                    });
                                    return;
                                  }
                                  this.navCtrl.setRoot(ThankyouPage, {
                                    message: {
                                      title: "Thank you",
                                      body:
                                        "Your subscription has been registered successfully.",
                                      type: "success"
                                    }
                                  });
                                }
                              );
                            });
                        }
                      );
                    }
                  );
                } else {
                  this.navCtrl.setRoot(ThankyouPage, {
                    message: {
                      title: "Oops!",
                      body: data["message"],
                      type: "error"
                    }
                  });
                }
              },
              err => {
                loadingProcessing.dismiss();
                this.navCtrl.setRoot(ThankyouPage, {
                  message: {
                    title: "Oops!",
                    body: err.error.message,
                    type: "error"
                  }
                });
              }
            );
        }
      });
    });
  }

  message() {
    this.navCtrl.push(MessagePage);
  }
  thankyou() {
    this.navCtrl.setRoot(ThankyouPage);
  }
}

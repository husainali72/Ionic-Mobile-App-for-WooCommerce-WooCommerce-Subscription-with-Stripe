import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { HttpClientModule } from "@angular/common/http";
import { Push } from "@ionic-native/push";
import { OneSignal } from "@ionic-native/onesignal";

import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { MessagePage } from "../pages/message/message";
import { MessagePageModule } from "../pages/message/message.module";
import { CartPage } from "../pages/cart/cart";
import { CartPageModule } from "../pages/cart/cart.module";
import { CheckoutPage } from "../pages/checkout/checkout";
import { CheckoutPageModule } from "../pages/checkout/checkout.module";
import { ThankyouPage } from "../pages/thankyou/thankyou";
import { ThankyouPageModule } from "../pages/thankyou/thankyou.module";
import { BillingPage } from "../pages/billing/billing";
import { BillingPageModule } from "../pages/billing/billing.module";
import { AboutPage } from "../pages/about/about";
import { AboutPageModule } from "../pages/about/about.module";
import { ContactPage } from "../pages/contact/contact";
import { ContactPageModule } from "../pages/contact/contact.module";
import { WelcomePage } from "../pages/welcome/welcome";
import { WelcomePageModule } from "../pages/welcome/welcome.module";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { RegisterPage } from "../pages/register/register";
import { RegisterPageModule } from "../pages/register/register.module";
import { PortalPage } from "../pages/portal/portal";
import { PortalPageModule } from "../pages/portal/portal.module";

import { ProvidersWoocommerce } from "../providers/providers-woocommerce/providers-woocommerce";
import { ProvidersConfig } from "../providers/providers-config";
import { SocialSharing } from "@ionic-native/social-sharing";

@NgModule({
  declarations: [
    MyApp,
    HomePage
    //RegisterPage,
    //MessagePage,
    //CartPage,
    //CheckoutPage,
    //ThankyouPage,
    //BillingPage,
    //AboutPage,
    //ContactPage,
    //WelcomePage,
    //PortalPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          autoFocusAssist: false,
          scrollAssist: true
        }
      }
    }),
    AboutPageModule,
    BillingPageModule,
    CartPageModule,
    CheckoutPageModule,
    ContactPageModule,
    MessagePageModule,
    PortalPageModule,
    RegisterPageModule,
    ThankyouPageModule,
    WelcomePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegisterPage,
    MessagePage,
    CartPage,
    CheckoutPage,
    ThankyouPage,
    BillingPage,
    AboutPage,
    ContactPage,
    WelcomePage,
    PortalPage
  ],
  providers: [
    SocialSharing,
    StatusBar,
    SplashScreen,
    OneSignal,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ProvidersWoocommerce,
    Push,
    ProvidersConfig
  ]
})
export class AppModule {}

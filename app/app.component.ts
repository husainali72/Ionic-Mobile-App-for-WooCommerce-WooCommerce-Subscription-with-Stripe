import { Component, ViewChild } from "@angular/core";
//import { Push, PushObject, PushOptions } from "@ionic-native/push";
import { Nav, Platform, AlertController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { RegisterPage } from "../pages/register/register";
import { AboutPage } from "../pages/about/about";
import { ContactPage } from "../pages/contact/contact";
import { WelcomePage } from "../pages/welcome/welcome";
import { PortalPage } from "../pages/portal/portal";
import { MessagePage } from "../pages/message/message";
//import { ProvidersConfig } from "../providers/providers-config";
//import { HttpClient, HttpHeaders } from "@angular/common/http";
//import { URLSearchParams } from "@angular/http";
import { OneSignal } from "@ionic-native/onesignal";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;
  rootPage: any = WelcomePage;

  pages: Array<{ title: string; component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    //public config: ProvidersConfig,
    //public http: HttpClient,
    private oneSignal: OneSignal
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      //this.showSplash = false;
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.statusBar.hide();
      this.splashScreen.hide();
      this.oneSignal.startInit(
        "fe8a309b-c53f-4256-9245-bb4c486e4541",
        "203725114996"
      );

      this.oneSignal.inFocusDisplaying(
        this.oneSignal.OSInFocusDisplayOption.Notification
      );

      this.oneSignal.registerForPushNotifications();

      this.oneSignal.handleNotificationReceived().subscribe(res => {
        // do something when notification is received
        console.log("Push notification recieved");
        if (res.payload.additionalData.foreground) {
          let confirmAlert = this.alertCtrl.create({
            title: res.payload.title,
            message: res.payload.body,
            buttons: [
              {
                text: "Ignore",
                role: "cancel"
              },
              {
                text: "View",
                handler: () => {
                  //TODO: Your logic here
                  this.nav.push(MessagePage);
                }
              }
            ]
          });
          confirmAlert.present();
        }
      });

      this.oneSignal.handleNotificationOpened().subscribe(res => {
        //console.log("Push notification opened");
        //console.log(res);
        this.nav.push(MessagePage);
      });

      this.oneSignal.endInit();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  openHomePage() {
    this.nav.setRoot(WelcomePage);
  }
  openMessagePage() {
    this.nav.setRoot(MessagePage);
  }
  openRegisterPage() {
    this.nav.setRoot(RegisterPage);
  }
  openContactPage() {
    this.nav.setRoot(ContactPage);
  }
  openAboutPage() {
    this.nav.setRoot(AboutPage);
  }
  openPortalPage() {
    this.nav.setRoot(PortalPage);
  }
}

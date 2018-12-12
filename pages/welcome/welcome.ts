import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
import { HomePage } from "../home/home";
import { PortalPage } from "../portal/portal";
import { SocialSharing } from "@ionic-native/social-sharing";

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-welcome",
  templateUrl: "welcome.html"
})
export class WelcomePage {
  url: string;
  title: string;
  body: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private socialSharing: SocialSharing,
    private alertCtrl: AlertController
  ) {
    this.url = "#";
    this.title = "Lorem Ipsum: A Page Title";
    this.body =
      "Download this app from " +
      this.url +
      " and register for membership today. Members enjoy unlimited consultations with board-certified Physicians 24/7 and unlimited Telephonic Counseling access. Up to 7 family members are included with one membership";
  }

  shareFacebook() {
    this.socialSharing
      .shareViaFacebook(this.body)
      .then(() => {
        // Success!
        console.log("Share Facebook");
      })
      .catch(() => {
        this.appNotInstalledError("Facebook");
      });
  }

  shareTwitter() {
    this.socialSharing
      .shareViaTwitter(this.body)
      .then(() => {
        // Success!
        console.log("Share Twitter");
      })
      .catch(() => {
        this.appNotInstalledError("Twitter");
      });
  }

  shareMail() {
    this.socialSharing
      .shareViaEmail(this.body, this.title, [this.url])
      .then(() => {
        // Success!
        console.log("Share Email");
      })
      .catch(() => {
        console.log("Error Mail");
      });
  }

  shareWhatsapp() {
    this.socialSharing
      .shareViaWhatsApp(this.body)
      .then(() => {
        // Success!
      })
      .catch(() => {
        this.appNotInstalledError("WhatsApp");
      });
  }

  appNotInstalledError(appname) {
    let confirmAlert = this.alertCtrl.create({
      title: "Install " + appname,
      message:
        "It doesn't seems that " +
        appname +
        " installed in your mobile. Please download this and try again.",
      buttons: [
        {
          text: "Ok",
          role: "cancel"
        }
      ]
    });
    confirmAlert.present();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad WelcomePage");
  }

  homeStudentPage() {
    this.navCtrl.setRoot(HomePage);
  }

  homeIndividualPage() {
    this.navCtrl.setRoot(HomePage);
  }

  homePortalPage() {
    this.navCtrl.setRoot(PortalPage);
  }
}

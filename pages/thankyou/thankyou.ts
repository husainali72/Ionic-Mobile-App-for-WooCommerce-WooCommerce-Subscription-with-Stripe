import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { MessagePage } from "../message/message";
import { WelcomePage } from '../welcome/welcome';

/**
 * Generated class for the ThankyouPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-thankyou',
  templateUrl: 'thankyou.html',
})
export class ThankyouPage {
  message: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.message = this.navParams.get("message");
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad ThankyouPage');
  }

  backtohome() {
    this.navCtrl.setRoot(WelcomePage);
  }

  backtoRegister() {
    this.navCtrl.setRoot(RegisterPage);
  }

  notification() {
    this.navCtrl.push(MessagePage);
  }

}

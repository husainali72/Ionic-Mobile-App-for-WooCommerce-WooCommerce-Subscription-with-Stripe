import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { ProvidersConfig } from "../../providers/providers-config"
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the MessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  postList: any[];
  page: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public http: HttpClient, public config: ProvidersConfig,
    public loadingCtrl: LoadingController) {
    this.postList = [];
    this.page = 1;
  }

  ngOnInit() {
    let loading = this.loadingCtrl.create({
      content: 'Loading messages...'
    });
    loading.present();
    this.http.get(this.config.getApiBase() + "wp/v2/posts?page=" + this.page
    ).subscribe(data => {
      loading.dismiss();
      for (var i in data) {
        var postData = {
          title: data[i].title.rendered,
          content: this.htmlToPlaintext(data[i].content.rendered)
        }
        this.postList.push(postData);
      }
    }, err => {
      loading.dismiss();
    });
  }

  htmlToPlaintext(text) {
    return text ? String(text).replace(/<[^>]+>/gm, '') : '';
  }

  loadMoreProducts(event) {
    let loading = this.loadingCtrl.create({
      content: 'Loading messages...'
    });
    loading.present();
    this.page++;
    this.http.get(this.config.getApiBase() + "wp/v2/posts?page=" + this.page
    ).subscribe(data => {
      loading.dismiss();
      let temp = 0;
      for (var i in data) {
        var postData = {
          title: data[i].title.rendered,
          content: this.htmlToPlaintext(data[i].content.rendered)
        }
        this.postList.push(postData);
        temp++;
      }
      event.complete();

      if (temp < 10) event.enable(false);
    }, err => {
      loading.dismiss();
    });
  }
}

import { Injectable } from '@angular/core';

/*
  Generated class for the CProgramFilesGitSrcProvidersConfigTsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProvidersConfig {

  constructor() {
    //console.log('Hello Config Provider');
  }

  getBaseUrl() {
    return "https://www.example.com";
  }

  getApiBase() {
    return this.getBaseUrl() + "/wp-json/";
  }

  getCustomApiBase() {
    return this.getApiBase() + "ionicstripe/v1/";
  }

  getPushApiBase() {
    return this.getBaseUrl() + "/pnfw/";
  }

  getWooConsumerKey() {
    return "WooCommerceConsumerKey"; //Live
  }

  getWooConsumerSecret() {
    return "WooCommerceConsumerSecretKey"; //Live
  }

  getStripeKey() {
    return "pk_live_STRIPEKEY";
  }

}
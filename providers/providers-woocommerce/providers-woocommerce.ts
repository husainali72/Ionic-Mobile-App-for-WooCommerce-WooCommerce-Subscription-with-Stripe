import { Injectable } from "@angular/core";
import * as WC from "woocommerce-api";
import { ProvidersConfig } from "../providers-config"

/*
  Generated class for the ProvidersWoocommerceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProvidersWoocommerce {
  Woocommerce: any;
  WoocommerceV2: any;

  constructor(private config: ProvidersConfig) {
    var baseUrl = this.config.getBaseUrl();
    var consumerKey = this.config.getWooConsumerKey();
    var consumerSecret = this.config.getWooConsumerSecret();
    this.Woocommerce = WC({
      url: baseUrl,
      consumerKey: consumerKey,
      consumerSecret: consumerSecret,
      wpAPI: true,
      version: "wc/v1"
    });

    this.WoocommerceV2 = WC({
      url: baseUrl,
      consumerKey: consumerKey,
      consumerSecret: consumerSecret,
      wpAPI: true,
      version: "wc/v2",
      isSsl: true,
      verifySsl: true,
      queryStringAuth: true
    });
  }

  init(v2?: boolean) {
    if (v2) {
      return this.WoocommerceV2;
    } else {
      return this.Woocommerce;
    }

  }
}

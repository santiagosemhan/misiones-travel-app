import { browser } from 'protractor';
import { Platform } from '@ionic/angular';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { MsgService } from './msg.service';
import { environment } from 'src/environments/environment';

interface OptionsType {
  headers?: HttpHeaders | { [header: string]: string | string[] },
  observe?: "body";
  params?: HttpParams | { [param: string]: string | string[] },
  reportProgress?: boolean;
}

const httpOptions = {
  headers: new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  )

};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  host: string;

  apiUrl: string;

  options: OptionsType;

  token: string;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private msg: MsgService,
    private platform: Platform
  ) {

    this.apiUrl = environment.apiUrl;

    // if (environment.api.path) {
    //   this.url = this.host + '/' + environment.api.path;
    // }

    this.options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    }

    this.setToken()

  }

  async setToken(token?) {
    this.token = token ? token : await this.storage.get('token')
  }


  get(endpoint: string, params?: any, options?: OptionsType) {

    // let search = new URLSearchParams();
    let search = new HttpParams();

    for (let k in params) {
      if (k == 'fields' || k == 'filters' || k == 'filter') {
        search = search.append(k, JSON.stringify(params[k]));
        // search.set(k, JSON.stringify(params[k]));
      } else {
        search = search.append(k, params[k]);
      }
    }

    let reqOpts = httpOptions.headers

    if (this.token) {
      reqOpts = httpOptions.headers.set('Authorization', `${this.token}`)
    } else {
      //TODO
    }
    // let version = environment.api.version ? `/${environment.api.version}/` : '/'
    return this.http.get(this.apiUrl + "/" + endpoint, { headers: reqOpts, params });
  }

  async load(endPoint, params?, msg?, showError = true): Promise<any> {

    let presentLoad: HTMLIonLoadingElement

    if (msg) {
      presentLoad = await this.msg.presentLoading(msg)
    }

    return new Promise((resolve, reject) => {

      this.get(endPoint, params).subscribe((res: Response) => {

        if (msg) {
          presentLoad.dismiss()
        }
        resolve(res);

      }, (err) => {


        if (msg) {
          presentLoad.dismiss()
        }

        this.errorHandler(err, showError);

        reject(err);

      });
    });

  }

  post(endpoint: string, reqParams?: any, headers?: HttpHeaders) {

    let reqOpts: any

    if (headers) {
      reqOpts = {
        headers: headers
      }
    } else {
      reqOpts = httpOptions
    }

    let params = new HttpParams()

    if (this.token) {
      reqOpts = reqOpts.headers.set('Authorization', `${this.token}`)
    } else {
      //TODO
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + "/" + endpoint, reqParams, { headers: reqOpts, params })
        .subscribe((data) => {
          resolve(data)
        }, (err) => {
          reject(err)
        })
    });
  }

  login(endpoint: string, reqParams?: any, headers?: HttpHeaders) {

    let reqOpts: any

    if (headers) {
      reqOpts = {
        headers: headers
      }
    } else {
      reqOpts = httpOptions
    }

    let params = new HttpParams()

    if (this.token) {
      reqOpts = reqOpts.headers.set('Authorization', `${this.token}`)
    } else {
      //TODO
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + endpoint, reqParams, { headers: reqOpts, params })
        .subscribe((data) => {
          resolve(data)
        }, (err) => {
          reject(err)
        })
    });
  }


  patch(endpoint: string, data?: any, options?: OptionsType) {

    if (!options) {
      options = {};
    }

    let headers = new HttpHeaders().append('Content-Type', 'application/json');

    if (this.token) {

      headers.set('authorization', `${this.token}`);
    } else {
      //TODO
    }

    return new Promise((resolve, reject) => {
      this.http.patch(this.apiUrl + "/" + endpoint, data, this.options)
        .subscribe((data) => {
          resolve(data)
        }, (err) => {
          reject(err)
        })
    });
  }

  put(resource: any, id?: number, reqParams?: any, headers?: HttpHeaders) {

    let reqOpts: any

    let params = new HttpParams()

    if (headers) {
      reqOpts = {
        headers: headers
      }
    } else {
      reqOpts = httpOptions
    }

    if (this.token) {

      reqOpts = httpOptions.headers.set('authorization', `${this.token}`);
    } else {
      //TODO
    }

    if (id) {
      resource = resource + '/' + id
    }

    return new Promise((resolve, reject) => {
      this.http.put(this.apiUrl + "/" + resource, reqParams, { headers: reqOpts })
        .subscribe((data) => {
          resolve(data)
        }, (err) => {
          reject(err)
        })
    });
  }

  delete(endpoint: string, id) {

    return new Promise((resolve, reject) => {
      this.http.delete(this.apiUrl + '/' + endpoint + '/' + id).subscribe((data) => {
        resolve(data)
      }, (err) => {
        reject(err)
      })
    });

  }
  errorHandler(err, showError = true) {

    console.log(err)

    if (!err.ok) {
      if (err.status == 401) {

        // this.events.publish('unautorized');

      }
    }

  }
}

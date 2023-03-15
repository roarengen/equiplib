import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AccountService } from 'src/app/services/user.service';

@Injectable()
export class CustomHttpClient {

  constructor(
    private http: HttpClient,
    private accountService: AccountService) {
    }

  createAuthorizationHeader(headers: HttpHeaders) {
    headers.append('Authorization', 'Basic ' +
      btoa(this.accountService.token));
  }

  get(url: string) {
    if (this.accountService.token != "") return this.http.get(url)
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  post(url: string, data: any) {
    if (this.accountService.token != "") return this.http.post(url, data)
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }
}

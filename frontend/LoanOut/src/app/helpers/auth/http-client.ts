import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AccountService } from 'src/app/services/user.service';

@Injectable({ providedIn: 'root' })
export class CustomHttpClient {

  public token!: string
  constructor(
    private http: HttpClient)
    {
    }

  createAuthorizationHeader(headers: HttpHeaders) {
    console.log(headers.append('Authorization', 'Basic ' +
      this.token));
  }

  get<T>(url: string) {
    if (this.token === undefined) return this.http.get<T>(url)
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    console.log(headers)
    return this.http.get<T>(url, {
      headers: headers, withCredentials: true
    });
  }

  post<T>(url: string, data: any) {
    if (this.token == undefined) return this.http.post<T>(url, data)
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    return this.http.post<T>(url, data, {
        headers: headers, withCredentials: true
    });
  }
}

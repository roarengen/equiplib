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

  private createAuthorizationHeader() {
    return new HttpHeaders({'Authorization': 'Basic ' +
      this.token});
  }
  addBypass(headers: HttpHeaders) {
    return headers.append('ngsw-bypass', "true");
  }

  get<T>(url: string) {
    if (this.token === undefined) return this.http.get<T>(url)
    return this.http.get<T>(url, {
        headers:this.createAuthorizationHeader()
    });
  }

  post<T>(url: string, data: any) {
    if (this.token == undefined) return this.http.post<T>(url, data, {
        headers:this.addBypass(new HttpHeaders())
    })
    return this.http.post<T>(url, data, {
      headers: this.addBypass(this.createAuthorizationHeader())
    });
  }

  put<T>(url: string, data: any) {
    if (this.token == undefined) return this.http.put<T>(url, data, {
        headers:this.addBypass(new HttpHeaders())
    })
    return this.http.put<T>(url, data, {
      headers: this.addBypass(this.createAuthorizationHeader())
    });
  }


  patch<T>(url: string, data: any) {
    if (this.token == undefined) return this.http.patch<T>(url, data, {
        headers:this.addBypass(new HttpHeaders())
    })
    return this.http.patch<T>(url, data, {
      headers: this.addBypass(this.createAuthorizationHeader())
    });
  }
}

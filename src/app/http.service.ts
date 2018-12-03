import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class HttpService {
  constructor(private readonly http: HttpClient) {}

  getBladeRunner(): Observable<any> {
    return this.http.get("?t=blade+runner");
  }
}

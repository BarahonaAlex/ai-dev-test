import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Param } from '../class/Param';
import { UrlUtils } from '../util/UrlUtils';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  getData<R>(
    baseUrl: string,
    params?: string | string[] | Param[],
    options?: {}
  ) {

    return this.html.get<R>(this.createUrl(baseUrl, params), options);
  }

  createUrl(baseUrl: string, params?: string | string[] | Param[]): string {
    if (!params) return baseUrl;
    if (typeof params == 'string')
      return `${baseUrl}/${params}`;
    if (params instanceof Array && typeof params[0] == 'string')
      return `${baseUrl}/${params.join('/')}`;
    else return `${baseUrl}${UrlUtils.toQueryParams(params as Param[])}`;
  }

  constructor(protected html: HttpClient) { }


  getPhotos(params:Param[]): Observable<any[]> {
  
    return this.getData<any[]>(`http://localhost:8080/api/externalapi/photos`, params);
  }

}

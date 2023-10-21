import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Param } from '../class/Param';
import { UrlUtils } from '../util/UrlUtils';
import { Observable } from 'rxjs/internal/Observable';
import { reqBody } from '../interface/reqBody';
import { environment } from 'src/environment/environment';


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
  
    return this.getData<any[]>(`${environment.BACKEND_URL}api/externalapi/photos`, params);
  }

  createImage(pText: string): Observable<any> {
    let val : reqBody = {prompt: pText, n: 1, size: '1024x1024'}
    const headers = { 'Authorization': `Bearer ${environment.OPENAI_API_KEY}` };
    return this.html.post<any>(`${environment.OPEN_AI}v1/images/generations`,
    val, { headers });
  }

}

import { HttpHeaders } from "@angular/common/http";
import { Param } from "../class/Param";


export class UrlUtils {
 
  static toQueryParams(params: Param[]): string {
    return `?${params.filter(param => param[Object.keys(param)[0]]).map((param) => `${Object.keys(param)[0]}=${param[Object.keys(param)[0]]}`).join("&")}`;
  }

 
  static toHeaders(params?: Param[]): HttpHeaders {
    var headers = new HttpHeaders();
    params?.forEach((param) => {
      headers = headers.append(param['key'], param['value']);
    });
    return headers;
  }
}
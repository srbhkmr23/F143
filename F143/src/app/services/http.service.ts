import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
//import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class HttpService {

    constructor(public http: HttpClient) {
    }

    callApi(dataObject): Observable<any> {
        let method = dataObject.method;
        let url = dataObject.url;
        let headers: any = new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8' });

        let option = {
            body: dataObject.requestBodyData || {},
            headers: headers
        }

        return this.http.request(method, url, option)
            .pipe(
                tap(
                    result => {
                        return result;
                    },
                    error => {
                        console.log('fetched error', error)
                        return error
                    })
            );
    }
}

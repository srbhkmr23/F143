import { Injectable, ErrorHandler } from '@angular/core';
import { HttpService } from '../services/http.service';

@Injectable()
export class TotalService {
    public totalAmounts:any;
    public msg:any;
    public allItems:any;

    constructor(public httpService: HttpService, public errHandler: ErrorHandler ){
        this.totalAmounts = 0;
        this.msg = {};
        this.allItems = [];
    }

    showitems(){
        
        let dataObj =
          {
              url: "http://localhost:3000/get_all_items",
              method: "GET",
              requestBodyData: null
          };
    
          this.httpService.callApi(dataObj).subscribe(
            response =>
            {
              let responseBody = response;
              
               if(responseBody.errorCode.code == 200 || responseBody.errorCode.message == 'success')
               {
                this.totalAmounts = responseBody['totalAmount'];
                this.allItems = responseBody['items']; 
                          
                
               }
               else
               {
               this.msg =  this.errHandler.handleError(responseBody.errorCode.toString());
               }
            },
              error =>
              {
              console.log("error in total amount", error);
              }
          );
      }
}
import { Component, OnInit, ErrorHandler } from '@angular/core';
import { HttpService } from '../services/http.service';
import {NgForm, FormBuilder, Validators} from '@angular/forms';


@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.css']
})
export class EstimateComponent implements OnInit {

  public estimateForm:any;
  public allItems:any;
  public msg:any;
  public fromDate:any;
  public toDate:any;
  public purchasedBy:string;
  public sum:any;
  public tableShow:boolean;

  constructor(public httpService: HttpService, public errHandler: ErrorHandler, public _formBuilder:FormBuilder) { 
    this.estimateForm = this._formBuilder.group({
      fromDate: ["", Validators.required],
      toDate: ["", Validators.required],
      purchasedBy: ["", [Validators.required, Validators.pattern("^[a-zA-Z]+$")]]
    })
    
  }

  ngOnInit() {
    this.tableShow = false;
  }


  getEstimate(){

    let bodyData = {
      "fromDate" : this.fromDate,
      "toDate" : this.toDate,
      "purchasedBy" : this.purchasedBy
      };
      

    let dataObj =
      {
          url: "https://f143-backend.herokuapp.com/estimate",
          method: "POST",
          requestBodyData: bodyData
      };

      this.httpService.callApi(dataObj).subscribe(
        response =>
        {
          let responseBody = response;
           if(responseBody.errorCode.code == 200 || responseBody.errorCode.message == 'success')
           {          

            this.allItems = responseBody['items'];  
            this.sum = responseBody.sum;
            this.tableShow = true;           
            
           }
           else
           {
           this.msg = this.errHandler.handleError(responseBody.errorCode.toString());
           this.tableShow = true; 
           }
        },
          error =>
          {
          console.log("error in getting items", error);
          this.tableShow = true; 
          }
      );
  }


}

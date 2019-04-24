import { Component, OnInit, Inject, ErrorHandler } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {NgForm, FormBuilder, Validators} from '@angular/forms';
import { HttpService } from '../services/http.service';
import { TotalService } from '../services/total.service';

@Component({
  selector: 'app-modalcomponent',
  templateUrl: './modalcomponent.component.html',
  styleUrls: ['./modalcomponent.component.css']
})

export class Modalcomponent implements OnInit {

  public itemDetails:any;
  public updateItemForm:any;
  public itemNameForm: boolean;
  public QtyForm: boolean;
  public PriceForm: boolean;
  public purchaseDateForm: boolean;
  public purchasedByForm: boolean;
  public itemName: string;
  public Qty: any;
  public Price: any;
  public purchaseDate: any;
  public purchasedBy: string;
  public isUpdateTrue: boolean;
  public isUpdateFalse : boolean;
  public msg:any;
  // public allItems:any;
 
  constructor(public httpService : HttpService, public totalService: TotalService, public dialogRef: MatDialogRef<Modalcomponent>, @Inject(MAT_DIALOG_DATA) data, public _formBuilder: FormBuilder, public errHandler:ErrorHandler) {  
    this.updateItemForm = this._formBuilder.group({
      itemName: ["", [Validators.required, Validators.pattern("^[a-zA-Z]+$")]],
      Qty: ["", [Validators.required, Validators.pattern("^[0-9]+$")]],
      Price: ["", [Validators.required, Validators.pattern("^[0-9]+$")]],
      purchaseDate: ["", Validators.required],
      purchasedBy: ["", [Validators.required, Validators.pattern("^[a-zA-Z]+$")]]
    })
    
    this.itemDetails = data;
    
   }

  ngOnInit() {
    this.msg= {};
    this.itemName = "";
    this.isUpdateFalse = true;
    this.isUpdateTrue = false;
  }

  onUpdate(){
    this.isUpdateTrue = true;
    this.isUpdateFalse = false;
    this.itemName = this.itemDetails.item_name;
    this.Qty = this.itemDetails.qty;
    this.Price = this.itemDetails.price;
    this.purchaseDate = this.itemDetails.purchase_date;
    this.purchasedBy = this.itemDetails.purchased_by;
  }

  saveDetails() {
    
  }

  onDelete(){
    
        var itemId = this.itemDetails.item_id;
  
      let dataObj =
      {
          url: "http://localhost:3000/delete_item/"+itemId,
          method: "DELETE",
          requestBodyData: null
      };
      
      this.httpService.callApi(dataObj).subscribe(
        response =>
        {
          let responseBody = response;
          if(responseBody.errorCode.code == 200 || responseBody.errorCode.message == 'success')
          {       
            var allItems = responseBody['items'];   
            this.dialogRef.close(allItems);
          }
          
            this.msg = this.errHandler.handleError(responseBody.errorCode.toString());
          
        },
          error =>
          {
          console.log("error in add items",error);
          }
        ); 
  }

  close() {
    this.dialogRef.close();
  }

  
}

import { Component, OnInit, ErrorHandler } from '@angular/core';
import {NgForm, FormBuilder, Validators} from '@angular/forms';
import { HttpService } from '../services/http.service';
import { TotalService } from '../services/total.service';


@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.css']
})

export class AdditemComponent implements OnInit {
  

  public addItemForm:any;
  public itemNameValid: boolean;
  public QtyValid: boolean;
  public purchaseDateValid: boolean;
  public PriceValid: boolean;
  public submitted: boolean;
  public purchasedByValid: boolean;
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
  public msg: void;

  constructor(public httpService: HttpService, public totalService: TotalService, public _formBuilder: FormBuilder, public errHandler : ErrorHandler) {
    this.addItemForm = this._formBuilder.group({
      itemName: ["", [Validators.required, Validators.pattern("^[a-zA-Z]+$")]],
      Qty: ["", [Validators.required, Validators.pattern("^[0-9]+$")]],
      Price: ["", [Validators.required, Validators.pattern("^[0-9]+$")]],
      purchaseDate: ["", Validators.required],
      purchasedBy: ["", [Validators.required, Validators.pattern("^[a-zA-Z]+$")]]
    })
   }

  ngOnInit() {
    this.itemNameValid = false;
    this.QtyValid = false;
    this.purchaseDateValid = false;
    this.PriceValid = false;
    this.submitted = false;
    this.purchasedByValid = false;
    this.itemNameForm = false;
    this.QtyForm = false;
    this.PriceForm = false;
    this.purchaseDateForm = false;
    this.purchasedByForm = false;
    this.itemName= "";
    this.Qty = "";
    this.Price = "";
    this.purchaseDate="";
    this.purchasedBy="";
  }

  validateFields()
  {
    this.itemNameValid      = true;
    this.QtyValid           = true;
    this.PriceValid         = true;
    this.purchaseDateValid  = true;
    this.purchasedByValid   = true;
    this.submitted          = true;


    this.itemNameValid      = this.addItemForm.controls.itemName.valid;
    this.QtyValid           = this.addItemForm.controls.Qty.valid;
    this.PriceValid         = this.addItemForm.controls.Price.valid;
    this.purchaseDateValid  = this.addItemForm.controls.purchaseDate.valid;
    this.purchasedByValid   = this.addItemForm.controls.purchasedBy.valid;
    this.addItemForm.Valid  = this.addItemForm.valid;
    
  }

  removeErrorClass(name) {
    if (this.submitted) {
      switch (name) {
        case "itemName":
          this.itemNameForm = false;
          break;

        case "Qty":
          this.QtyForm = false;
          break;

        case "Price":
          this.PriceForm = false;
          break;
 
        case "purchaseDate":
          this.purchaseDateForm = false;
          break;

        case "purchasedBy":
            this.purchasedByForm = false;
            break;
      }
    }
  }

  resetaddItemForm() {
    this.itemName = "";
    this.Qty = "";
    this.Price = "";
    this.purchaseDate = "";
    this.purchasedBy = "";
    this.addItemForm.controls.itemName.touched = false;
    this.addItemForm.controls.Qty.touched = false;
    this.addItemForm.controls.Price.touched = false;
    this.addItemForm.controls.purchaseDate.touched = false;
    this.addItemForm.controls.purchasedBy.touched = false;
  }

  submitItem(){
    this.validateFields();
    let bodyData = {
      "itemName"    : this.itemName.trim(), 
      "Qty"         : this.Qty,
      "Price"       : this.Price,
      "purchaseDate": this.purchaseDate,
      "purchasedBy" : this.purchasedBy
      };
      

    let dataObj =
    {
        url: "https://f143-backend.herokuapp.com/add_items",
        method: "POST",
        requestBodyData: bodyData
    };
    
    this.httpService.callApi(dataObj).subscribe(
      response =>
      {
        let responseBody = response;
        if(responseBody.errorCode.code == 200 || responseBody.errorCode.message == 'success')
        {         
          this.resetaddItemForm();   
          this.totalService.showitems();      
        }
        
          this.msg = this.errHandler.handleError(responseBody.errorCode.toString());
        
      },
        error =>
        {
        console.log("error in add items",error);
        }
      );
    }
  

  


}

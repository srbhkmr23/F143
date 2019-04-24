import { Component, OnInit, ErrorHandler} from '@angular/core';
import { HttpService } from '../services/http.service';
import { TotalService } from '../services/total.service';
import { MatDialog,MatDialogConfig } from "@angular/material";
import {Modalcomponent} from '../modalcomponent/modalcomponent.component';

@Component({
  selector: 'app-showitems',
  templateUrl: './showitems.component.html',
  styleUrls: ['./showitems.component.css']
})
export class ShowitemsComponent implements OnInit {

  public allItems:any;
  public msg:any;
  public total:number;
  public closeResult: string;
  public dialogeRef:any;
  public searchString: string;
  
  constructor(public httpService: HttpService, public errHandler: ErrorHandler, public totalService: TotalService, private dialog: MatDialog) {
    this.showitems();
   }

  ngOnInit() {
    this.allItems = [];
    this.msg = "";
    this.total = 0;
    
  }

  openDialog(itemDetail) {
    const dialogConfig = new MatDialogConfig();  
    dialogConfig.data = itemDetail;
    this.dialogeRef = this.dialog.open(Modalcomponent, dialogConfig);
    this.dialogeRef.afterClosed().subscribe(result => {
      if(typeof result != 'undefined')
        this.allItems = result; 
    });
  }

  


  showitems(){
    let dataObj =
      {
          url: "https://f143-backend.herokuapp.com/get_all_items",
          method: "GET",
          requestBodyData: null
      };

      this.httpService.callApi(dataObj).subscribe(
        response =>
        {
          let responseBody = response;
           if(responseBody.errorCode.code == 200 || responseBody.errorCode.message == 'success')
           {          

            this.allItems = responseBody['items'];             
            
           }
           else
           {
           this.msg = this.errHandler.handleError(responseBody.errorCode.toString());
           }
        },
          error =>
          {
          console.log("error in getting items", error)
          }
      );
  }

 
 
}

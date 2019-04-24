import { Component, OnInit, ErrorHandler } from '@angular/core';
import { TotalService } from '../services/total.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})

export class NavigationComponent implements OnInit {

  constructor(public totalService:TotalService) {
    
  } 

  ngOnInit() {   
    this.totalService.showitems();
  }

  

}

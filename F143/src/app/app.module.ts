import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdditemComponent } from './additem/additem.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatNativeDateModule, MatIconModule, MatSidenavModule, MatListModule, MatToolbarModule} from '@angular/material';
import { NavigationComponent } from './navigation/navigation.component';
import { HttpService } from './services/http.service';
import { ShowitemsComponent } from './showitems/showitems.component';
import { TotalService } from './services/total.service';
import { MatDialogModule } from "@angular/material";
import { Modalcomponent } from './modalcomponent/modalcomponent.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FilterPipe } from './searchFilter.pipe';
import { EstimateComponent } from './estimate/estimate.component';

const appRoutes : Routes= [
  { path: 'additem', component: AdditemComponent },
  { path: 'showitems', component: ShowitemsComponent },
  { path: 'monthly_estimate', component: EstimateComponent },
  { path: '', redirectTo: '/additem', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    AdditemComponent,
    NavigationComponent,
    ShowitemsComponent,
    Modalcomponent,
    FilterPipe,
    EstimateComponent
  ],
  imports: [
    BrowserModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    MatDialogModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    CommonModule, 
    MatButtonModule,
    MatToolbarModule, 
    MatNativeDateModule, 
    MatIconModule, 
    MatSidenavModule,
    MatListModule
  ],
  exports: [
    CommonModule, 
    MatButtonModule, 
    MatToolbarModule, 
    Modalcomponent,
    MatNativeDateModule, 
    MatIconModule, 
    MatSidenavModule, 
    MatListModule
  ],
  providers: [HttpService,TotalService],
  bootstrap: [AppComponent],
  entryComponents: [Modalcomponent]
})
export class AppModule { }

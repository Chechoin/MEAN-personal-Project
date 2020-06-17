import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit,DoCheck{
  public title:string;
  public identity;
  public token;
  public url:string;
  
  constructor(
    private _route:ActivatedRoute,
    private _router: Router,
    private _userService:UserService
  ){
    this.title = 'Bring Light';
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }
  ngDoCheck(){
    this.identity=this._userService.getIdentity();
  }
  logout(){
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._router.navigate(['/']);
  }
}
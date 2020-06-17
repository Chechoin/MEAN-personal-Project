import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    providers: [UserService]
})
export class LoginComponent implements OnInit{
    public title:string;
    public user:User;
    public status: string;
    public identity;
    public token;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.title = 'Identificate';
        this.user = new User(
            "",
            "",
            "",
            "",
            "",
            "",
            "ROLE_USER",
            ""
        );
    }

    ngOnInit(){
        console.log('Componente de login cargado...');
    }
    
    onSubmit(){
        //Loguear al usuario y conseguir sus datos
        this._userService.signup(this.user).subscribe(
            response => {
                this.identity = response.user;
                
                if(!this.identity || !this.identity._id){
                    this.status = 'error';
                }
                else{
                    this.status = "success";
                    //persistir datos del usuario
                    localStorage.setItem('identity',JSON.stringify(this.identity));
                    //Conseguir el token jwt
                    this.getToken();
                }
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if(errorMessage != null){
                    this.status = 'error';
                }
            }
        );
    }
    getToken(){
                //Loguear al usuario y conseguir sus datos
                this._userService.signup(this.user,'true').subscribe(
                    response => {
                        this.token = response.token;
                        console.log(this.token);
                        
                        if(this.token <= 0){
                            this.status = 'error';
                        }
                        else{
                            this.status = "success";
                            //persistir token del usuario
                            localStorage.setItem('token',JSON.stringify(this.token));//Aqui lo tiene diferente, solo this.token
                            //Conseguir los contadores o estadisticas del usuario

                            this._router.navigate(['/']);
                        }
                    },
                    error => {
                        var errorMessage = <any>error;
                        console.log(errorMessage);
                        if(errorMessage != null){
                            this.status = 'error';
                        }
                    }
                );
    }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core-module/error-handler.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';




@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(  
    private auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router) { 
   
  }

  ngOnInit(): void {
  }


  login(usuario: string, senha: string){
    this.auth.login(usuario, senha)   
    .then(() => {
      this.router.navigate(['/casamentos']);
    })
    .catch(erro => {
      this.errorHandler.handle(erro);
    });
  }

  getAuth(){
    return this.auth;
  }

}

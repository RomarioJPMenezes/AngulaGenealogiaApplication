import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, ConfirmEventType, LazyLoadEvent, MessageService, PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { ErrorHandlerService } from 'src/app/core-module/error-handler.service';
import { Usuario } from 'src/app/core-module/model';
import { AuthService } from 'src/app/seguranca/auth.service';
import { UsuarioFiltro, UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-pesquisa-usuario',
  templateUrl: './pesquisa-usuario.component.html',
  styleUrls: ['./pesquisa-usuario.component.css']
})
export class PesquisaUsuarioComponent implements OnInit {

  @Input() registrosUsuario: any = {};
  @Input() filtro: UsuarioFiltro = new UsuarioFiltro();
  @Input() totalElementos = 0;
  @ViewChild('tabela') grid!: Table;

  usuario: any;



  constructor(private usuarioService: UsuarioService,
                private messageService: MessageService,
                private primengConfig: PrimeNGConfig,
                private confirmationService: ConfirmationService,
                private errorHandlerService: ErrorHandlerService,
                private auth: AuthService
             
                ) { 

  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    
  }

  getAuth(){
    return this.auth;
  }

  pesquisa(){
    this.usuarioService.pesquisar(this.filtro).then(resultado => {
      this.registrosUsuario = resultado.usuarios;
      this.totalElementos = resultado.total;
    });
  }

  aoMudarPagina(event: LazyLoadEvent){
    const pagina: number = event!.first! / event!.rows!;
    this.filtro.pagina = pagina;
    this.pesquisa();
  }

  excluir(usuario: Usuario){  
    console.log(usuario);
    this.usuarioService.excluir(usuario.codigo)
    .then(()=>{
      //this.grid.reset();
      this.usuario = null;
      this.pesquisa();
      
    }).catch(erro =>{
        this.errorHandlerService.handle(erro);
    });
  }

  confirmarExclusao(casamento: any) {
    this.confirmationService.confirm({
        message: 'Tem certeza que deseja exclu??r este registro?',
        header: 'Confirmar exclus??o de Registro',
        accept: () => {
          this.onConfirm(casamento);
          this.messageService.add({severity:'info', summary:'Confirmado', detail:'Registro Deletado'});
        }, reject: (type: any) => {
          switch(type) {
              case ConfirmEventType.REJECT:
                  this.messageService.add({severity:'error', summary:'Rejeitado', detail:'Opera????o rejeitada, registro n??o deletado!'});
              break;
              case ConfirmEventType.CANCEL:
                  this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Opera????o cancelou, registro n??o deletado!"'});
              break;
          }
      }
    });
  }


  onConfirm(usuario: any) {
    this.usuario = usuario;
    this.excluir(this.usuario);
    
    this.messageService.clear('c');
}

  onReject() {
      this.messageService.clear('c');
      this.usuario = null;
  }


  clear() {
  this.messageService.clear();
  }
}

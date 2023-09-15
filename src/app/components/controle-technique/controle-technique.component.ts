import { Component } from '@angular/core';

@Component({
  selector: 'app-controle-technique',
  templateUrl: './controle-technique.component.html',
  styleUrls: ['./controle-technique.component.css']
})
export class ControleTechniqueComponent {
  

  changeBefore(id:string){
    console.log('hello')
    document.getElementById(id)?.parentElement?.classList.add('is-active')
  };
}

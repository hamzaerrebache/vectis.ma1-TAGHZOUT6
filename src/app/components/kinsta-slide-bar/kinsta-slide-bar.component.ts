import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kinsta-slide-bar',
  templateUrl: './kinsta-slide-bar.component.html',
  styleUrls: ['./kinsta-slide-bar.component.css']
})
export class KinstaSlideBarComponent implements OnInit {
  ngOnInit(): void {
  }
  changeBefore(id:string){
    if(id=='marketLink1'){
      document.getElementById(id)?.parentElement?.classList.add('is-active')
      document.getElementById('marketLink2')?.parentElement?.classList.remove('is-active')
      document.getElementById('marketLink3')?.parentElement?.classList.remove('is-active')
      document.getElementById('marketLink4')?.parentElement?.classList.remove('is-active')
    }
    if(id=='marketLink2'){
      document.getElementById(id)?.parentElement?.classList.add('is-active')
      document.getElementById('marketLink1')?.parentElement?.classList.remove('is-active')
      document.getElementById('marketLink3')?.parentElement?.classList.remove('is-active')
      document.getElementById('marketLink4')?.parentElement?.classList.remove('is-active')
    }
    if(id=='marketLink3'){
      document.getElementById(id)?.parentElement?.classList.add('is-active')
      document.getElementById('marketLink2')?.parentElement?.classList.remove('is-active')
      document.getElementById('marketLink1')?.parentElement?.classList.remove('is-active')
      document.getElementById('marketLink4')?.parentElement?.classList.remove('is-active')
    }
    if(id=='marketLink4'){
      document.getElementById(id)?.parentElement?.classList.add('is-active')
      document.getElementById('marketLink2')?.parentElement?.classList.remove('is-active')
      document.getElementById('marketLink3')?.parentElement?.classList.remove('is-active')
      document.getElementById('marketLink1')?.parentElement?.classList.remove('is-active')
    }
    
  };

}
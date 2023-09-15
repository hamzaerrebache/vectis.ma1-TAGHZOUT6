import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-periode',
  templateUrl: './periode.component.html',
  styleUrls: ['./periode.component.css']
})
export class PeriodeComponent {
constructor(private router:Router){
  console.log(this.router.url)
}

}

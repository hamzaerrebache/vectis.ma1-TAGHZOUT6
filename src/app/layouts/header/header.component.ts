import { Component,OnInit } from '@angular/core';
import {ActivatedRoute,NavigationEnd,Router} from '@angular/router';
import {FormGroup,FormBuilder} from '@angular/forms';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
 

  suggestions:string[]=["Azemmour","DEKRA PORTE 4", "DEKRA PORTE 2","DEKRA PORTE 3","CVT El khalil","Centre wifak","CVTM","Visite T .NEAB"]
  Ville:string[]=["Casablanca","Mohammedia"]
  NomReseau:string[]=["DEKRA","REVITEX","SALAMA","SGS"]
  nom!:string;
  filteredSuggestions: string[] = [];
  searchText = '';
  isAccueilRoute!:boolean;
  isServicesRoute!:boolean;
  isControleRoute!:boolean;
  


  myForm!:FormGroup

  ngOnInit(): void {
    this.myForm = this.fb.group({
      city: '',
      Vile: '',
      nReseau: ''
    });

    
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAccueilRoute = (event.url === '/' || event.url === '/Accueil');
      }
      if (event instanceof NavigationEnd) {
        this.isServicesRoute = (event.url === '/Rendez-vous' || event.url === '/Reclamation' || event.url==='/Comment');
      }
      if (event instanceof NavigationEnd) {
        this.isControleRoute = (event.url === '/ControleTechnique' || event.url === '/ouvrir-centre-visite-technique-maroc' || event.url==='/Tarifs' || event.url==='/P%C3%A9riodicit%C3%A9' || event.url==='/Conseils-de-securite');
      }
    
    });
    
 
  }
  
  constructor(
     public router: Router,
     public activatedRoute: ActivatedRoute, private fb:FormBuilder 
     ) {
    
    }
      
     

   
     onInputChange(): void {
       this.filteredSuggestions = this.suggestions.filter(suggestion =>
         suggestion.toLowerCase().includes(this.searchText.toLowerCase())
       );
     }


  
     
     onSearch() {
      this.router.navigate(['List-centres'], {
        queryParams: { name: this.myForm.value.city, ville: this.myForm.value.Vile ,nomReseau: this.myForm.value.nReseau }
       
      });
     
      this.myForm.reset();
      
    }
 
}

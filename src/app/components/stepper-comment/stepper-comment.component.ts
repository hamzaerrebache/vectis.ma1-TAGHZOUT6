import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {DatePipe, NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import Swal from 'sweetalert2';
import { RatingModule } from 'primeng/rating';
import {ActivatedRoute,Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Center } from 'src/app/models/Center.model';
import {Commentaire} from 'src/app/models/Commentaie.model';
import {CommentaireService} from 'src/app/Services/commentaire.service';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';


 enum TYPE {
  ERROR='error',
  SUCCESS='success',
  WARNING='warning',
  INFO='info',
  QUESTION='question'
}


interface Times {
  value: string;
  viewValue: string;
}
// interface Centres {
//   value: number;
//   viewValue: string;
// }
// interface City {
//   name: string;
//   code: string;
// }
interface DropdownOptions{
  label:string;
  value:string;
}
interface TypeReclamations{
  name: string;
  code: string;
} 
interface StatutVehicules{
  name: string;
  code: string;
}
interface Resolution{
  name: string;
  code: string;
}
@Component({
  selector: 'app-stepper-comment',
  templateUrl: './stepper-comment.component.html',
  styleUrls: ['./stepper-comment.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
  standalone: true,
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule, 
    NgFor,
    RatingModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
  ],
})
export class StepperCommentComponent  implements OnInit {
  stepperFormGroup!: FormGroup; // Utilisation de l'opérateur '!' pour indiquer qu'elle sera initialisée
  firstFormGroup !: FormGroup;
  thirdFormGroup !: FormGroup;



  stepper: any;
  newDate!:string;
  centerName!:string
  centers:Center[]=[];
  cities: string[] = [];
  selectedCity !: string;
  dropdownOptions !:DropdownOptions[];
  isSelectDisabled: boolean = true; 
  statut:boolean=false;
  selectedCentreId: number | null = null;
  countries: any[] | undefined;
  selectedCountry: string | undefined;
  filteredCentres : Center []= this.centers;
  filteredCities: string[] = this.cities;
  selectedCentre !: Center;
  selected: Center | null = null;
  nameFile !:string;
  formattedDate :any;
  starRating!: number;
  value!: number;
 
 
  

  times: Times[] = [
    {value: '9:00 AM - 11:00 AM', viewValue: '9:00 AM - 11:00 AM'},
    {value: '11:00 AM - 13:00 PM', viewValue: '11:00 AM - 13:00 PM'},
    {value: '13:00 PM - 15:00 PM', viewValue: '13:00 PM - 15:00 PM'},
    {value: '15:00 PM - 17:00 PM', viewValue: '15:00 PM - 17:00 PM'},
    {value: '17:00 PM - 19:00 PM', viewValue: '17:00 PM - 19:00 PM'}
  ];
  // centres: Centres[] = [
  //   {value: 1, viewValue: 'Azemmour'},
  //   {value: 2, viewValue: 'Dekra porte 4'},
  //   {value: 3, viewValue: 'Cvt el khalil'},
  //   {value: 4, viewValue: 'Wifak'},
  //   {value: 5, viewValue: 'Socotex Control'},
  //   {value: 6, viewValue: 'Lnti'},
  //   {value: 7, viewValue: 'T.NEAB'},
  //   {value: 8, viewValue: 'Cvtm'}
  // ];

  // Filtrage des centres en fonction de selectedCentreId
  reseaux: string[] = ['','DEKRA', 'REVITEX', 'SGS', 'SALAMA'];
  selectedReseau: string | null = null;

  
  constructor(
    private _formBuilder: FormBuilder,
    public router: Router,
    public activatedRoute: ActivatedRoute,private http:HttpClient,
    private datePipe:DatePipe,
    public commentaireService :CommentaireService
  ) {

    const currentDate = new Date();
    this.formattedDate = this.datePipe.transform(currentDate, 'dd/MM/yyyy HH:mm');
  }
  

  ngOnInit() {
    this.http.get<Center[]>('https://controleapi.vercel.app/Centres').subscribe(
      (data) => {
          this.centers=data;
          this.filteredCentres = data;
          console.log(this.centers)

          this.cities = [...new Set(data.map(centre => centre.ville))];

          const idCentre: string | null = localStorage.getItem('selectedCentreId');

          if (idCentre !== null) {
            this.selectedCentreId = parseInt(idCentre, 10);
            // Vous pouvez utiliser this.selectedCentreId pour effectuer des actions si nécessaire
            console.log("selectedCentreId ", this.selectedCentreId );
          } else {
            this.selectedCentreId = null;
            console.log("selectedCentreId ", this.selectedCentreId );
          }

          if (this.selectedCentreId !== null) {
            const selectedCentre = this.filteredCentres.find(centre => centre.id === this.selectedCentreId);
            if (selectedCentre) {
              this.selected = selectedCentre;
              console.log('this.selected.id',this.selected?.id)
              console.log("selectedCentre", this.selected?.name);
            } else {
              console.log('Centre introuvable');
            }
          } else {
            console.log('Aucun centre sélectionné');
          }

          if (this.selectedReseau !== null) {
            this.filteredCentres = this.filterCentresByReseau(this.selectedReseau);
          }

      },
      error=>{
        console.log(error)
      }
    )
    this.dropdownOptions = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' }
    ];

  
    this.stepperFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      thirdCtrl: ['', Validators.required],
    });

    this.firstFormGroup = this._formBuilder.group({
      centreCtrl: ['',Validators.required] 
    });
  
    this.thirdFormGroup = this._formBuilder.group({
     // Contrôle pour le choix d'attendre ou de déposer le véhicule
     rating: ['',Validators.required],
     name: ['',Validators.required],
     description: ['',Validators.required],
       // Contrôle pour choisir le centre de service
    });
    console.log( this.thirdFormGroup );
    
  }



 


  compareCentres(centre1: any, centre2: any) {
    return centre1 && centre2 && centre1.id === centre2.id;
  }

  filterCentres(event: any) {
    const filterValue = event.target.value.toLowerCase();
    this.filteredCentres = this.centers.filter(centre =>
      centre.name.toLowerCase().includes(filterValue) &&
      centre.ville === this.selectedCity
    );
  }

  filterCities(event: any) {
    const filterValue = event.target.value.toLowerCase();
    this.filteredCities = this.cities.filter(city =>
      city.toLowerCase().includes(filterValue)
    );
  }

  onCitySelect(city: string) {
    console.log(city)
    this.selectedCity = city;

    this.filteredCentres = this.centers.filter(centre =>
      centre.ville === city
    );
  }

  onReseauSelect(reseau: string) {
    this.selectedReseau = reseau;
    
    console.log("onReseauSelect",this.selectedCity);

    if (!this.selectedCity) {
       this.filteredCentres = this.filterCentresByReseau(this.selectedReseau);
    } else {
      this.filteredCentres = this.filterCentresByReseauAndCity(this.selectedReseau, this.selectedCity);
    }
  }
  
  // Fonction de filtrage par réseau
  filterCentresByReseau(reseau: string): Center[] {
    return this.centers.filter(centre => centre.nomReseau === reseau);
  }
  
  // Fonction de filtrage par réseau et par ville
  filterCentresByReseauAndCity(reseau: string, city: string): Center[] {
    return this.centers.filter(centre => centre.nomReseau === reseau && centre.ville === city);
  }

 


  getName(): string | undefined {
    const selectedCentreId = this.thirdFormGroup.get('centreCtrl')?.value;
    const selectedCentre = this.centers.find(centre => centre.id === selectedCentreId);
  
    if (selectedCentre) {
      return selectedCentre.name;
    }
  
    return undefined;
  }

  getLogReseau(){
    const selectedCentreId = this.thirdFormGroup.get('centreCtrl')?.value;
    const selectedCentre = this.centers.find(centre => centre.id === selectedCentreId);
  
    if (selectedCentre) {
      return selectedCentre.logReseau;
    }
  
    return undefined;
  }

  // Reste du code...
  submitfeedbackData() {
 
    
    const feedbackData :Commentaire = {
      id: 0,
      // Données de la première étape
      centre_id: this.firstFormGroup.get('centreCtrl')?.value,
      name:this.thirdFormGroup.get('name')?.value,
      // Données de la deuxième étape
      description:this.thirdFormGroup.get('description')?.value,
     
      value:this.thirdFormGroup.get('rating')?.value,
   
      date:this.formattedDate
    };
    console.log('feedbackData',feedbackData);
     this.commentaireService.createCommentaire(feedbackData).subscribe(
      response => {
        console.log('Commentaire créé avec succès !', response);
        // Réinitialiser le groupe de formulaires et le stepper
        this.stepperFormGroup.reset();
        
      },
      error => {
        console.error('Une erreur est survenue lors de la création du Commentaire :', error);
      },
     )
  
        this.isSelectDisabled= false; 
        localStorage.removeItem('selectedCentreId');
       
  }
  

  formatDateForDisplay(date: Date | null): string {
    if (date) {
      const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      return formattedDate;
    }
    return '';
  }
  showSwwal(){
    Swal.fire({
      title: 'Votre Réclamation a été effectué. Vérifiez votre e-mail pour obtenir votre code de suivi',
      text: "Retour à la page d'accueil",
      icon: TYPE.SUCCESS,
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
      
        window.location.href = '/'; 
     
      }
    });;
  }
}
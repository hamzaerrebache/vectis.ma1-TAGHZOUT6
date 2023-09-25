import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import Swal from 'sweetalert2';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import {ActivatedRoute,Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Center } from 'src/app/models/Center.model';
import { Reclamation } from 'src/app/models/Reclamation.model';
import { ReclamationService } from './../../Services/reclamation.service';


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
  selector: 'stepers-reclamation',
  templateUrl: './stepers-reclamation.component.html',
  styleUrls: ['./stepers-reclamation.component.css'],
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
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
  ],
})
export class StepersReclamationComponent  implements OnInit {
  stepperFormGroup!: FormGroup; // Utilisation de l'opérateur '!' pour indiquer qu'elle sera initialisée
  firstFormGroup !: FormGroup;
  thirdFormGroup !: FormGroup;
  fifthFormGroup !: FormGroup;
  sixthFormGroup !: FormGroup;


  stepper: any;
  newDate!:string;
  centerName!:string
  centers:Center[]=[];
  cities: string[] = [];
  selectedCity !: string;
  dropdownOptions !:DropdownOptions[];
  isSelectDisabled: boolean = true; 
  statut:boolean=false;
  selectedReceipt: string | ArrayBuffer | null = null;
  selectedPhoto: string | ArrayBuffer | null = null;
  selectedCentreId: number | null = null;
  countries: any[] | undefined;
  selectedCountry: string | undefined;
  filteredCentres : Center []= this.centers;
  filteredCities: string[] = this.cities;
  selectedCentre !: Center;
  selected: Center | null = null;
  nameFile !:string;
  
  

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
  typeReclamations :TypeReclamations[] =[
    {name : 'problème technique' , code : 'problème technique'},
    {name : 'mauvais service' , code :  'mauvais service' },
    {name : "temps d'attente" , code : "temps d'attente"},
    {name : 'autre' , code : 'autre'},
  ];
  statutVehicules :StatutVehicules[] =[
    {name : "En possession" , code : "En possession"},
    {name : "Restitué après la visite technique" , code : "Restitué après la visite technique"}
  ];

  resolutions :Resolution[] =[
    {name : 'remboursement' , code : 'remboursement'},
    {name : 'nouvelle visite' , code : 'nouvelle visite'},
    {name : 'correction du problème' , code : 'correction du problème'},
  ];
  reseaux: string[] = ['','DEKRA', 'REVITEX', 'SGS', 'SALAMA'];
  selectedReseau: string | null = null;

  constructor(
    private _formBuilder: FormBuilder,
    private reclamationService: ReclamationService,
    public router: Router,
    public activatedRoute: ActivatedRoute,private http:HttpClient
  ) {}

  // private generateTrackingCode(): string {
  //   const timestamp = new Date().getTime();
  //   const randomString = Math.random().toString(36).substring(2, 10);
  //   return `${timestamp}-${randomString}`;
  // }
  private generateTrackingCode():string {
    const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const captchaLength = 6;
    
    let captcha = '';
    for (let i = 0; i < captchaLength; i++) {
      const randomIndex = Math.floor(Math.random() * possibleCharacters.length);
      captcha += possibleCharacters.charAt(randomIndex);
    }
    
    return captcha;
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
      fifthCtrl: ['', Validators.required],
    });

    this.firstFormGroup = this._formBuilder.group({
      PreCtrl: ['',  [Validators.required, Validators.maxLength(100)]],
      NomCtrl: ['',  [Validators.required, Validators.maxLength(100)]],
      EmailCtrl: ['', [Validators.required, Validators.email]],
      TeleCtrl: ['',  [Validators.required,Validators.minLength(10), Validators.pattern(/^[0-9]{10}$/)]],
      MatriculeCtrl: ['', [Validators.required, Validators.maxLength(10)]],
    });
  
    this.thirdFormGroup = this._formBuilder.group({
     // Contrôle pour le choix d'attendre ou de déposer le véhicule
      centreCtrl: ['',Validators.required] // Contrôle pour choisir le centre de service
    });
    console.log( this.thirdFormGroup );
    
    this.fifthFormGroup = this._formBuilder.group({
      descriptionCtrl: ['', Validators.required],
      receiptCtrl: ['', Validators.required], // Contrôle pour la date du rendez-vous
       // Contrôle pour l'heure du rendez-vous
     
    });


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

  onReceiptChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedReceipt = e.target?.result as string | ArrayBuffer;
      };
      reader.readAsDataURL(input.files[0]);
     this.nameFile=input.files[0].name
    } else {
      this.selectedReceipt = null;
    }
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
  submitReclamationData() {
 
    
    const reclamationData :Reclamation = {
      id: 0,
      // Données de la première étape
      first_name: this.firstFormGroup.get('PreCtrl')?.value,
      last_name: this.firstFormGroup.get('NomCtrl')?.value,
      email: this.firstFormGroup.get('EmailCtrl')?.value,
      tele: this.firstFormGroup.get('TeleCtrl')?.value,
      matricule : this.firstFormGroup.get('MatriculeCtrl')?.value,
      // Données de la deuxième étape
    
      // Données de la troisième étape
      centre_id: this.thirdFormGroup.get('centreCtrl')?.value,

      // Données de la quatrième étape

     // Données de la quatrième étape
      description:this.fifthFormGroup.get('descriptionCtrl')?.value,
      copyReceipt:this.fifthFormGroup.get('receiptCtrl')?.value,

    
     // Données de la 6 étape
      trackingCode:this.generateTrackingCode(),
      statut:this.statut
    };
    console.log('reclamationData',reclamationData);

   

    const foundCenter = this.centers.find(center => center.id === reclamationData.centre_id);

    if (foundCenter) {
       this.centerName = foundCenter.name;
      
    } else {
      console.log('Centre introuvable pour cet ID.');
    }

 
    const messageContent = `
    Bonjour ${reclamationData.first_name} ${reclamationData.last_name},
    Nous avons bien reçu votre réclamation concernant votre récente visite dans notre centre de service automobile.
    Votre code de suivi pour cette réclamation est : 
   
  `;
  const messageContent1 =`
  Nous apprécions vos commentaires et nous travaillons à résoudre vos préoccupations dès que possible.
  Si vous avez d'autres questions ou mises à jour concernant votre réclamation, n'hésitez pas à nous contacter à l'adresse ${this.centerName}@gmail.com.
  Nous vous remercions de votre compréhension.
  Cordialement,
  L'équipe du service client`
 
    emailjs.send('service_052ho5g', 'template_yviy42s', {
      message:messageContent, message1:messageContent1,
      From:`${this.centerName}@gmail.com`,
      To:reclamationData.email,
      subject:'Objet : Confirmation de votre plainte',
      code:reclamationData.trackingCode
    }
    , 'vpH_f734YyMUE8QmG')
      .then((result: EmailJSResponseStatus) => {
        console.log(result.text);
      }, (error) => {
        console.log(error.text);
      });
    // Appel à la méthode de service pour créer le rendez-vous
    this.reclamationService.createReclamation(reclamationData).subscribe(
      response => {
        console.log('Rendez-vous créé avec succès !', response);
        // Réinitialiser le groupe de formulaires et le stepper
        this.stepperFormGroup.reset();
        
      },
      error => {
        console.error('Une erreur est survenue lors de la création du rendez-vous :', error);
      },
      );
      this.stepper.reset();
  
        // Swal.fire({
        //   title: 'Votre Réclamation a été effectué. Vérifiez votre e-mail pour obtenir votre code de suivi',
        //   text: "Retour à la page d'accueil",
        //   icon: TYPE.SUCCESS,
        //   confirmButtonText: 'OK',
         
        // }).then((result) => {
        //   if (result.isConfirmed) {
          
        //     window.location.href = '/'; 
         
        //   }
        // });
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
      title: 'Votre réclamation a été effectuée. Vérifiez votre e-mail pour obtenir votre code de suivi',
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
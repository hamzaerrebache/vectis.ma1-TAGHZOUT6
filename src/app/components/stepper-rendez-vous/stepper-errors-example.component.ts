import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { RendezVousService } from 'src/app/Services/rendez-vous.service';
import { RendezVous } from 'src/app/models/RendezVous';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import Swal from 'sweetalert2';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import * as CryptoJS from 'crypto-js';
import {ActivatedRoute,Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Center } from 'src/app/models/Center.model';
import { ReverseGeocodingServiceService } from 'src/app/Services/reverse-geocoding-service.service';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

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

interface City {
  name: string;
  code: string;
}
interface DropdownOptions{
  label:string;
  value:string;
}

@Component({
  selector: 'stepper-errors-example,component',
  templateUrl: 'stepper-errors-example.component.html',
  styleUrls: ['stepper-errors-example.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
  standalone: true,
  imports: [
    MatStepperModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule, 
    MatFormFieldModule,
    MatExpansionModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule
  ]
})
export class StepperErrorsExampleComponent  implements OnInit {
  stepperFormGroup!: FormGroup; // Utilisation de l'opérateur '!' pour indiquer qu'elle sera initialisée
  firstFormGroup !: FormGroup;
  secondFormGroup !: FormGroup;
  thirdFormGroup !: FormGroup;
  fourthFormGroup !: FormGroup;
  stepper: any;
  newDate!:string;
  centerName!:string
  centers:Center[]=[];
  cities: string[] = [];
  selectedCity !: string;
  dropdownOptions !:DropdownOptions[];
  isSelectDisabled: boolean = true; 
  selectedCentreId: number | null = null;
  filteredCentres : Center []= this.centers;
  filteredCities: string[] = this.cities;
  selectedCentre !: Center;
  selected: Center | null = null;
  open!:boolean;
  lat!:number;
  lng!:number;
  Centers1:any[]=[];
  latitude!: number;
  longitude!: number;
  CurrentAdress!: string;
  distance!: any;
  isStep1 = true;
  isEditable: boolean = false;
  steps: number[] = [1, 2, 3, 4];
  currentTime: Date = new Date();

  stepCompleted: boolean[] = [false, false, false, false, false];

  // Méthode pour déterminer si une étape est complétée
  isStepCompleted(step: number): boolean {
    return this.stepCompleted[step];
  }

  //@ViewChild('stepper') stepper!: MatStepper;

  times: Times[] = [
    { value: '9:00', viewValue: '9:00 AM - 9:20 AM' },
    { value: '9:20', viewValue: '9:20 AM - 9:40 AM' },
    { value: '9:40', viewValue: '9:40 AM - 10:00 AM' },
    { value: '10:00', viewValue: '10:00 AM - 10:20 AM' },
    { value: '10:20', viewValue: '10:20 AM - 10:40 AM' },
    { value: '10:40', viewValue: '10:40 AM - 11:00 AM' },
    { value: '11:00', viewValue: '11:00 AM -11:20 AM' },
    { value: '11:20', viewValue: '11:20 AM - 11:40 AM' },
    { value: '11:40', viewValue: '11:40 AM - 12:00 PM' },
    { value: '12:00', viewValue: '12:00 PM - 12:20 PM' },
    { value: '12:20', viewValue: '12:20 AM - 12:40 AM' },
    { value: '12:40', viewValue: '12:40 AM - 13:00 PM' },
    { value: '14:00', viewValue: '14:00 PM - 14:20 PM' },
    { value: '14:20', viewValue: '14:20 PM - 14:40 PM' },
    { value: '14:40', viewValue: '14:40 PM - 15:00 PM' },
    { value: '15:00', viewValue: '15:00 PM -  15:20 PM' },
    { value: '15:40', viewValue: '15:40 PM - 16:00 PM' },
    { value: '16:20', viewValue: '16:20 PM - 16:40 PM' },
  ];
  

  
  times2: Times[] = [
    {value: '9:00', viewValue: '9:00 AM - 9:30 AM'},
    {value: '9:30', viewValue:'9:30 AM - 10:00 AM'},
    {value: '10:00', viewValue: '10:00 AM - 10:30 AM'},
    {value: '10:30', viewValue: '10:30 AM - 11:00 AM'},
    {value: '11:00', viewValue: '11:00 AM - 11:30 AM'},
    {value: '11:30', viewValue: '11:30 AM - 12:00 PM'},
    {value: '12:30', viewValue: '12:30 PM - 13:00 PM'},
    {value: '14:00', viewValue: '14:00 PM - 14:30 PM'},
    {value: '14:30', viewValue: '14:30 PM - 15:00 PM'},
    {value: '15:00', viewValue: '15:00 PM - 15:30 PM'},
    {value: '15:30', viewValue: '15:30 PM - 16:00 PM'},
    {value: '16:00', viewValue: '16:00 PM - 16:30 PM'},
  ];

  typeVehicules : Times[]=[ 
    {value: 'VL', viewValue: 'Véhicule léger (VL)'},
    {value: 'PL', viewValue: 'Poid lourd  (PL)'}
   ];

   typeVisites : Times[]=[
    {value:'Périodique' ,viewValue:'Périodique'},
    {value:' Mutation' ,viewValue:' Mutation'},
    {value:' Volontaire ' ,viewValue:' Volontaire '}
  ]
  reseaux: string[] = ['','DEKRA', 'REVITEX', 'SGS', 'SALAMA'];
  selectedReseau: string | null = null;
 

  // Filtrage des centres en fonction de selectedCentreId




  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private rendezVousService: RendezVousService,
    public router: Router,
    public activatedRoute: ActivatedRoute,private http:HttpClient,
    private reverseGeocodingService: ReverseGeocodingServiceService,
  ) {}

  ngOnInit() {
    
    this.http.get<Center[]>('https://controleapi.vercel.app/Centres').subscribe(
      (data) => {
          this.centers=data
          console.log(this.centers)

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
      secondCtrl: ['', Validators.required],
      thirdCtrl: ['', Validators.required],
      fourthCtrl: ['', Validators.required]
    });

    this.firstFormGroup = this._formBuilder.group({
      typeVehiculeCtrl: ['', [Validators.required, Validators.maxLength(100)]],
      typeVisiteCtrl: ['', [Validators.required, Validators.maxLength(100)]]
    });

    this.firstFormGroup.get('typeVehiculeCtrl')?.valueChanges.subscribe(value => {
      console.log("Valeur de typeVehiculeCtrl :", value);
    });
  
    this.secondFormGroup = this._formBuilder.group({
          // Contrôle pour le choix d'attendre ou de déposer le véhicule
          centreCtrl: [''] // Contrôle pour choisir le centre de service
    });
  
    this.thirdFormGroup = this._formBuilder.group({
      PreCtrl: ['',  [Validators.required, Validators.maxLength(100)]],
      NomCtrl: ['',  [Validators.required, Validators.maxLength(100)]],
      EmailCtrl: ['', [Validators.required, Validators.email]],
      TeleCtrl: ['',  [Validators.required,Validators.minLength(10), Validators.pattern(/^[0-9]{10}$/)]],
    });
    this.fourthFormGroup = this._formBuilder.group({
      dateCtrl: ['', [Validators.required,this.dateSupérieureValidator()]], // Contrôle pour la date du rendez-vous
      timeCtrl: ['', Validators.required] // Contrôle pour l'heure du rendez-vous
    });
       this.getLocation();
  }

  dateSupérieureValidator() {
    return (control : FormControl): { [key: string]: any } | null => {
      const currentDate = new Date();
      const selectedDate = new Date(control.value);
      currentDate.setHours(0,0,0,0);
      selectedDate.setHours(0, 0, 0, 0);
      console.log("currentDate",currentDate);
      console.log("selectedDate",selectedDate);
          if (selectedDate < currentDate   ) {
      return { 'dateInvalide': true };
    }
    return null;
  };
  }

  validateTime() {
    const selectedTime = this.fourthFormGroup.get('timeCtrl')?.value;
    const selectedDate = this.fourthFormGroup.get('dateCtrl')?.value;
    const selectedTimeParts = selectedTime.split(':');
    const selectedHour = parseInt(selectedTimeParts[0]);
    const selectedMinute = parseInt(selectedTimeParts[1]);
  
    // Obtenir l'heure actuelle
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);

    console.log('validateTime selectedDate',selectedDate.getTime());

    console.log('validateTime currentTime',currentDate.getTime());

    if ( selectedDate.getTime()==currentDate.getTime()){
      if (selectedHour < currentHour || (selectedHour === currentHour && selectedMinute < currentMinute)) {
        // La valeur sélectionnée est inférieure à l'heure actuelle, donc la validation échoue.
        this.fourthFormGroup.get('timeCtrl')?.setErrors({ 'timeInvalid': true });
      } else {
        // Réinitialisez les erreurs si la valeur est valide.
        this.fourthFormGroup.get('timeCtrl')?.setErrors(null);
      }
    }
  }
  
  onSubmit() {
    this.open=true
    this.centers.forEach((center) => {
      let latitude!: any;
      let longitude: any;
      this.convertAddressToLatLng(center.adresse).then((coordinates) => {
        latitude = coordinates?.latitude;
        longitude = coordinates?.longitude;
        center.distance = Math.trunc(
          this.calculDistance(this.lat, this.lng, latitude, longitude)
        );
        let data = JSON.stringify({
          id: center.id,
          distance: center.distance,
          name: center.name,
          ville: center.ville,
          nomReseau: center.nomReseau,
          logReseau: center.logReseau,
        });
        const secret = '12345azerty[]@1';
        let encrypted = CryptoJS.AES.encrypt(data, secret).toString();

        localStorage.setItem('token1' + center.name, encrypted);

        const dataString = localStorage.getItem('token1' + center.name);
        var bytes = CryptoJS.AES.decrypt(dataString || '', secret);
        let datastring = bytes.toString(CryptoJS.enc.Utf8);
        if (datastring !== null) {
          const jsonObject = JSON.parse(data || '');
          console.log(jsonObject);
          this.Centers1.push({
            id: jsonObject.id,
            name: center.name,
            tele: center.tele,
            adresse: center.adresse,
            ville: center.ville,
            categorie: center.categorie,
            nomReseau: center.nomReseau,
            distance: jsonObject.distance,
            logReseau: center.logReseau,
          });
          this.Centers1.sort((a, b) => {
            if (a.distance !== b.distance) {
              return a.distance - b.distance;
            } else {
              if (a.name < b.name) {
                return -1;
              } else if (a.name > b.name) {
                return 1;
              } else {
                return 0;
              }
            }
          });
        }
      });
    });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.ConvertCoordinatesToAddress(this.lat, this.lng);
        },
        (error) => {
          if (error.code === 2) {
            alert('Location information is unavailable.');
          } else if (error.code === 3) {
            alert('Timed out while trying to get location.');
          }
        }
      );
    }

    console.log(this.Centers1);
  }

  calculDistance(
    latitude: number,
    longitude: number,
    latitude1: number,
    longitude1: number
  ): number {
    const fromCoordinates = { latitude: latitude, longitude: longitude };
    const toCoordinates = { latitude: latitude1, longitude: longitude1 };
    const distanceInKm = this.reverseGeocodingService.haversineDistance(
      fromCoordinates,
      toCoordinates,
      'km'
    );
    this.distance = distanceInKm;
    return this.distance;
  }

  ConvertCoordinatesToAddress(latitude: number, longitude: number) {
    return this.reverseGeocodingService
      .getAddress(latitude, longitude)
      .then((address) => {
        this.CurrentAdress = address;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  async convertAddressToLatLng(
    address: string
  ): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const location = await this.reverseGeocodingService.getCoordinates(
        address
      );
      let CurrentCoordinates = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
      return CurrentCoordinates;
    } catch (error) {
      console.error('Error converting address to coordinates:', error);
      return null;
    }
  }
  changer(name:string,id:number){
   console.log(name,id);
   this.secondFormGroup.value.centreCtrl=id;
   console.log(this.secondFormGroup.value.centreCtrl)
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
    const selectedCentreId = this.secondFormGroup.value.centreCtrl;
    const selectedCentre = this.centers.find(centre => centre.id === selectedCentreId);
  
    if (selectedCentre) {
      return selectedCentre.name;
    }
  
    return undefined;
  }

  getLogReseau(){
    const selectedCentreId = this.secondFormGroup.value.centreCtrl;
    const selectedCentre = this.centers.find(centre => centre.id === selectedCentreId);
  
    if (selectedCentre) {
      return selectedCentre.logReseau;
    }
  
    return undefined;
  }



  // Reste du code...
  submitRendezVous() {

    const rendezVousData :RendezVous = {
      id: 0,

      
      typeVehicule:this.firstFormGroup.get('typeVehiculeCtrl')?.value,
      typeVisite:this.firstFormGroup.get('typeVisiteCtrl')?.value,
      description: this.firstFormGroup.get('textCtrl')?.value,

      // Données de la troisième étape
      centre_id: this.secondFormGroup.value.centreCtrl,

      // Données de la première étape
      first_name: this.thirdFormGroup.get('PreCtrl')?.value,
      last_name: this.thirdFormGroup.get('NomCtrl')?.value,
      email: this.thirdFormGroup.get('EmailCtrl')?.value,
      tele: this.thirdFormGroup.get('TeleCtrl')?.value,

      // Données de la deuxième étap


      // Données de la quatrième étape
      date: this.fourthFormGroup.get('dateCtrl')?.value,
      time: this.fourthFormGroup.get('timeCtrl')?.value,
    };

    const date = new Date(rendezVousData.date);
     this.newDate = date.toLocaleDateString("fr-FR", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
});



    const foundCenter = this.centers.find(center => center.id === rendezVousData.centre_id);

    if (foundCenter) {
       this.centerName = foundCenter.name;
      
    } else {
      console.log('Centre introuvable pour cet ID.');
    }

 
    const messageContent = `
    

    Cher(e) ${rendezVousData.first_name} ${rendezVousData.last_name},
    
    Nous sommes ravis de confirmer votre prochain rendez-vous pour l'inspection de votre véhicule avec nous. Voici les détails de votre rendez-vous :
    
    Détails du rendez-vous :
    - Date : ${this.newDate}
    - Heure : ${rendezVousData.time}
    - Centre : ${this.centerName}
    
    Informations sur le véhicule :
    - genre de véhicule : ${rendezVousData.typeVehicule}
    - genre de visite: ${rendezVousData.typeVisite}
   
    
    Votre rendez-vous est important pour nous, et notre équipe est prête à vous offrir une expérience fluide. Si vous avez des questions ou si vous avez besoin d'apporter des modifications à votre rendez-vous, veuillez nous contacter à contoletechnique27000@gmail.com.
    
    Nous avons hâte de vous servir et de garantir la sécurité de votre véhicule.
    
    Cordialement,
    controletechnique.ma
  `;
 
    emailjs.send('service_nu1k82a', 'template_i6el8pk', {
      message:messageContent,
      From:'siliad@contact.ma',
      To:rendezVousData.email,
      subject:'Confirmation de votre rendez-vous pour l inspection de votre véhicule'
    }
    , 'PN9MwwaL0zw9s_F0V')
      .then((result: EmailJSResponseStatus) => {
        console.log(result.text);
      }, (error) => {
        console.log(error.text);
      });
    // Appel à la méthode de service pour créer le rendez-vous
    this.rendezVousService.createRendezVous(rendezVousData).subscribe(
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
      localStorage.removeItem('selectedCentreId');
  
       
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
      title: 'Votre rendez-vous a été effectué.',
      text: "Retour à la page d'accueil",
      icon: TYPE.SUCCESS,
      confirmButtonText: 'OK',
     
    }).then((result) => {
      if (result.isConfirmed) {
      
        window.location.href = '/'; 
     
      }
    });
  }
}
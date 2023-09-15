import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ReverseGeocodingServiceService } from '../../Services/reverse-geocoding-service.service';
import { Center } from '../../models/Center.model';
import {Coordinates} from '../../models/Coordinates.model';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, FormsModule, Validators} from "@angular/forms";
import { Message } from 'primeng/api';
import * as CryptoJS from 'crypto-js';


export interface City{
  idCity:number,
  nameCity:string
}
interface Reseau {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-centres',
  templateUrl: './centres.component.html',
  styleUrls: ['./centres.component.css'],
 
})


export class CentresComponent implements OnInit{
 
  lat!: number;
  lng!: number;
  CurrentAdress!: string;
  distance!: any;
  map!: L.Map;
  geograph!:boolean;
  CheckedList!:any[]
  centers!: Center[];
  Centers1: any[]=[];
  markers!:Coordinates[];
  nothing:boolean=false
  latitude!: number;
  longitude!: number;
  cities: City[] = [];
  Cities: string[] = ["casablanca","marrakech","salé","meknès","rabat",
  "agadir",
  "oujda",
  "kénitra",
  "tétouan",
  "laayoune",
  "mohammedia",
  "el jadida",
  "khouribga",
  "béni mellal",
  "khémisset",
  "nador",
  "tanger",
  "fes",
  "settat"];
  myForm!: FormGroup;
  Reseaux:string[]=["DEKRA","SGS","REVITEX","SALAMA",""]
  calcul:boolean=false;
  ville:string | any;
  nomReseau:string | any;
  messages: Message[]=[];
  messages1: Message[]=[];
  messages2: Message[]=[];
  error!: boolean;
  isChecked:boolean=false;
  Reseauxs: Reseau[] = [
    {value: '', viewValue: ''},
    {value: 'DEKRA', viewValue: 'DEKRA'},
    {value: 'REVITEX', viewValue: 'REVITEX'},
    {value: 'SGS', viewValue: 'SGS'},
    {value: 'SALAMA', viewValue: 'SALAMA'},
  
  ];

  constructor(private http:HttpClient,private reverseGeocodingService:ReverseGeocodingServiceService,public fb: FormBuilder) {
   
  }



  ngOnInit(): void {
    this.http.get<Center[]>('https://controleapi.vercel.app/Centres').subscribe(
      (data:Center[])=>{
        this.centers=data;
        console.log(this.centers)
        this.centers.sort((center1, center2) => {
          if (center1.name < center2.name) {
            return -1;
          } else if (center1.name > center2.name) {
            return 1;
          } else {
            return 0;
          }
        });
        
      },
      error=>{
        console.log(error);
  
      }
      );
      
      
   
    this.myForm = this.fb.group({
      city: {value:'',disabled:false},
      nomReseau:[''],
      checkboxControl: new FormControl(false)     
    });
    
    this.getLocation();
   
  
    
    
    
    
    let inc=0;
    this.centers.forEach((center) => {
      if (!this.cities.some((city) => city.nameCity === center.ville)) {
        inc=inc+1;
        this.cities.push({idCity:inc, nameCity: center.ville });
      }
      
    });  

  }


  onSubmit() {
    this.ville=this.myForm.value.city;
    this.nomReseau=this.myForm.value.nomReseau;
    this.isChecked=this.myForm.value.checkboxControl;
    this.error=this.myForm.value.checkboxControl;
    if(!this.Cities.includes(this.ville) && !this.Reseaux.includes(this.nomReseau)){
      this.error=true;
      this.ville=null;
      this.nomReseau=null;
      if(this.ville=='' && this.nomReseau==''){
        this.nothing=true
      }
    }

     
      this.getLocation();
    
      this.centers.forEach(center=>{
        let latitude!:any;
        let longitude:any;
      this.convertAddressToLatLng(center.adresse).then(coordinates=>{
         latitude=coordinates?.latitude;
         longitude=coordinates?.longitude;
         center.distance=Math.trunc(this.calculDistance(this.lat,this.lng,latitude,longitude));
         let data=JSON.stringify({id:center.id,distance:center.distance,name:center.name,ville:center.ville,nomReseau:center.nomReseau,logReseau:center.logReseau,lat:center.lat,lng:center.lng})
         const secret="12345azerty[]@";
         let encrypted=CryptoJS.AES.encrypt(data,secret).toString();
         localStorage.setItem('list_'+center.name,JSON.stringify({id:center.id,distance:center.distance}))
         localStorage.setItem('token'+center.name,encrypted);

        const dataString=localStorage.getItem('token'+center.name);
        var bytes  = CryptoJS.AES.decrypt(dataString || '',secret);
        let datastring =  bytes.toString(CryptoJS.enc.Utf8);
        if(datastring!==null){
        const jsonObject=JSON.parse(data);
          this.Centers1.push({id:jsonObject.id,name:center.name,tele:center.tele,
            adresse:center.adresse,
            ville:center.ville,
            categorie:center.categorie,
            nomReseau:center.nomReseau,
            distance:jsonObject.distance,
            logReseau:center.logReseau,
            lat:center.lat,
            lng:center.lng
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
    
    
  suggestions: string[] = [];
  typeahead: FormControl = new FormControl();
  suggest() {
    this.suggestions = this.Cities
      .filter(c => c.startsWith(this.typeahead.value))
      .slice(0, 5);
  }
  toggleCityInput(){
  
  }
  getCentersByCity(): Center[]  {
     return this.centers.filter((center) => center.ville.includes(this.ville));
  }
  getCentersByReseau(): Center[]  {
    return this.centers.filter((center) => center.nomReseau.includes(this.nomReseau));
 }
 getCentersByCityAndReseau(): Center[]  {
  return this.centers.filter((center) => center.nomReseau.includes(this.nomReseau ) && center.ville.includes(this.ville));
}

getCentersOnSortByReseauName(nomReseau:string){
  return this.Centers1.filter((center)=>center.nomReseau.includes(nomReseau))
}
getCentersOnSortByCity(city:string){
  return this.Centers1.filter((center)=>center.ville.includes(city))
}
getCentersOnSortCityandReseauName(ville:string,nomReseau:string){
  return this.Centers1.filter((center)=>(center.ville.includes(ville) && center.nomReseau.includes(nomReseau)))
}



  private initMap(): void {
    this.map = L.map('map').setView([this.lat,this.lng],9);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });    
    const myCustomColour = '#FF0000';

    const markerHtmlStyles = `
      background-color: ${myCustomColour};
      width: 2.5rem;
      height: 2.5rem;
      display: block;
      left: -1.5rem;
      top: -1.5rem;
      position: relative;
      border-radius: 2rem 3rem 0;
      transform: rotate(45deg);
      border: 1px solid #FFFFFF`
    
    const icon = L.divIcon({
      className: "my-custom-pin",
      html: `<span style="${markerHtmlStyles}" />`
    })

    const mark=L.marker([this.lat,this.lng],{icon:icon}).bindPopup(this.CurrentAdress);
    mark.addTo(this.map);
    tiles.addTo(this.map);

  }
  getLocation(){
   
    this.geograph=true;
    if (navigator.geolocation) {
      
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.ConvertCoordinatesToAddress(this.lat,this.lng)  
      },
      error=>{
       if (error.code === 2) {
          alert("Location information is unavailable.");
      } else if (error.code === 3) {
          alert("Timed out while trying to get location.");
      }

      });
    }
    
    this.initMap();
   
  
       
      

        

      console.log(this.Centers1);
      
      

      this.calcul=true;
  }

  calculDistance(latitude:number,longitude:number,latitude1:number,longitude1:number):number{
    const fromCoordinates= { latitude: latitude, longitude: longitude }; 
    const toCoordinates={ latitude: latitude1, longitude: longitude1 }; 
    const distanceInKm = this.reverseGeocodingService.haversineDistance(fromCoordinates, toCoordinates, 'km');
    this.distance=distanceInKm;  
    return this.distance;
}



  ConvertCoordinatesToAddress(latitude: number, longitude: number) {
    return this.reverseGeocodingService.getAddress(latitude, longitude).then((address) => {
      this.CurrentAdress=address;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  async convertAddressToLatLng(address:string): Promise<{ latitude: number; longitude: number; } |null>{
    try {
      const location = await this.reverseGeocodingService.getCoordinates(address);
      let CurrentCoordinates = { latitude: location.latitude, longitude: location.longitude };
      
        const mark=L.marker([CurrentCoordinates.latitude,CurrentCoordinates.longitude]).bindPopup(address);
        mark.addTo(this.map);
  

         return CurrentCoordinates;
     

    } catch (error) {
      console.error('Error converting address to coordinates:', error);
      return null;
    }
  }

  

}

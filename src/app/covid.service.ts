import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from './user.model';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';  
import { Observable } from 'rxjs';  
import { Country, Summary } from './api.model';

@Injectable({
  providedIn: 'root'
})
export class CovidService {

  private user!: User;
  private country!: Country
  private url: string = "https://api.covid19api.com/summary";  
  private url2: string ="https://corona.lmao.ninja/v2/historical/all";
  private url3: string ="https://corona.lmao.ninja/v2/historical/all?lastdays=8";

  constructor(private afAuth: AngularFireAuth, private router: Router, private firestore:  AngularFirestore, private http: HttpClient, private datepipe: DatePipe) {
    this.date = new Date();
   }

  summary: Summary;
  highlyConfirmedData: Array<Country>; 
  date: Date;
  
  getData(): Observable<any> {  
    return this.http.get(this.url)  
      .pipe((response1) => response1);  
  }  

  getDatad(): Observable<any>{
    return this.http.get(this.url3)
    .pipe((response2)=>response2);
  }

  getDataw(): Observable<any>{
    return this.http.get(this.url2)
    .pipe((response3)=>response3);
  }

  getDatacountry(slug: string, url4: string): Observable<any>{
    url4=url4.concat(slug);
    this.date.setDate(this.date.getDate()-1);
    let lldate : string = this.datepipe.transform(this.date, 'YYYY-MM-dThh:mm:ss')!;
    
    this.date.setDate(this.date.getDate()-7);
    let ldate : string = this.datepipe.transform(this.date, 'YYYY-MM-d')!;
    ldate= ldate.concat("T00:00:00Z");
    url4= url4.concat("?from=",ldate, "&to=",lldate,"Z");
    console.log(url4);
    return this.http.get(url4)
    .pipe((response5)=>response5);
  }

  getDatacountryone(slug: string, url5: string): Observable<any>{
    url5=url5.concat(slug);
    return this.http.get(url5)
    .pipe((response6)=>response6);
  }

  async signInWithGoogle(){
    const credientals =await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.user={ 
      uid: credientals.user?.uid!,
      displayName: credientals.user?.displayName!,
      email: credientals.user?.email!
    };
    localStorage.setItem("user", JSON.stringify(this.user));
    this.updateUserData(this.user);
    this.router.navigate(["homepage"]);
  }

  private updateUserData(user: User){
    this.firestore.collection("users").doc(user.uid).set({
        uid:user.uid,
        displayName: user.displayName,
        email: user.email
    }, {merge: true});
  }

  getUser(){
    if(this.user== null && this.userSignedIn()){
      this.user=JSON.parse(localStorage.getItem("user")!);
    }
    return this.user;
  }

  addCountryfirebase(country: Country){
  this.firestore.collection("countries").doc(country.Slug).get().subscribe((doc)=>{
    if(doc.exists){
      let array: any[] =[];
      array.push(doc.data());
      if(
        array[0].country != country.Country ||
        array[0].newdeaths != country.NewDeaths ||
        array[0].totaldeaths != country.TotalDeaths ||
        array[0].newrecovered != country.NewRecovered ||
        array[0].totalrecovered != country.TotalRecovered || 
        array[0].newconfirmed != country.NewConfirmed || 
        array[0].totalconfirmed != country.TotalConfirmed ||
        array[0].name != country.Slug ){
          this.firestore.collection("countries").doc(country.Slug).set({
            country: country.Country,
            newdeaths: country.NewDeaths,
            newrecovered: country.NewRecovered,
            newconfirmed: country.NewConfirmed,
            totaldeaths: country.TotalDeaths,
            totalrecovered: country.TotalRecovered,
            totalconfirmed: country.TotalConfirmed,
            slug: country.Slug
          }, {merge: true});
        }
    }else{
      this.firestore.collection("countries").doc(country.Slug).set({
        country: country.Country,
        newdeaths: country.NewDeaths,
        newrecovered: country.NewRecovered,
        newconfirmed: country.NewConfirmed,
        totaldeaths: country.TotalDeaths,
        totalrecovered: country.TotalRecovered,
        totalconfirmed: country.TotalConfirmed,
        slug: country.Slug
      }, {merge: true});
    }
    })
  }

  getCountryfirebase(slug : string): Observable<any>
  {
    return this.firestore.collection("countries")
    .doc(slug).valueChanges();
  }

  userSignedIn(): boolean{
    return JSON.parse(localStorage.getItem("user")!) != null;
  }

  signOut(){
    this.afAuth.signOut();
    localStorage.removeItem("user");
    this.user={} as any;
    this.router.navigate(["signin"]);
  }
}

import { ThisReceiver } from '@angular/compiler';

export class Summary {  
    Global: Global;  
    Countries: Array<Country>;  
    Date: Date;  
}  
  
export class Global {  
    NewConfirmed: number;  
    NewDeaths: number;  
    NewRecovered: number;  
    TotalConfirmed: number;  
    TotalDeaths: number;  
    TotalRecovered: number  
}  
  
export class Country extends Global {  
    Country: string;  
    CountryCode: string; 
    NewConfirmed: number;
    TotalConfirmed: number;
    NewDeaths: number;
    TotalDeaths: number;
    NewRecovered: number;
    TotalRecovered: number;
    Date: Date;  
    Slug: string;

    constructor(Country: string,
        CountryCode: string,
        NewConfirmed: number,
        TotalConfirmed: number,
        NewDeaths: number,
        TotalDeaths: number,
        NewRecovered: number,
        TotalRecovered: number,
        Date: Date,
        Slug: string){
        super();
            this.Country= Country;
            this.NewConfirmed= NewConfirmed;
            this.CountryCode= CountryCode;
            this.TotalConfirmed= TotalConfirmed;
            this.NewDeaths= NewDeaths;
            this.TotalDeaths= TotalDeaths;
            this.NewRecovered= NewRecovered;
            this.TotalRecovered= TotalRecovered;
            this.Date= Date;
            this.Slug=Slug;
        }
} 

export class  World {
    cases: number [];  
    deaths: number [];  
    recovered: number [];  
}

export class Countryrec {
    NewConfirmed: number;
        TotalConfirmed: number;
        NewDeaths: number;
        TotalDeaths: number;
        NewRecovered: number;
        TotalRecovered: number;
        Slug: string;
}
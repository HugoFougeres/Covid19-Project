import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Country, Summary } from '../api.model';
import { CovidService } from '../covid.service';
import {DatePipe, Location} from '@angular/common';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  country: Country;
  country1: Country;
  name: string;
  summary: Summary;
  activeCases: number;
  recoveryRate: number;
  mortalityRate: number;
  death: number;
  recovered: number;
  cases: number;
  Date!: string;
  Date1!: string;
  Date2!: string;
  Date3!: string;
  Date4!: string;
  Date5!: string;
  Date6!: string;
  Date7!: string;
  datetampon!: Date;
  wdeath: number [];
  wrecovered: number [];
  wconfirmed: number [];
  ncountry: string;
  name1: string;

  tcases: number;
  trecovered: number;
  tdeaths: number;
  ncases: number;
  nrecovered: number;
  ndeaths: number
  
  

  public pieChartOptions: ChartOptions= {
    responsive:true,
    legend:{
      position: 'top',
    },
    tooltips:{
      enabled: true,
      mode: 'single',
      callbacks:{
      }
    }
  };

  pieChartLabels: Label[]=[['Dead Cases'], ['Recovered Cases'], ["Active Cases"]];
  pieChartData: number[]= [];
  pieChartType: ChartType= 'pie';
  pieChartLegend=true;
  pieChartPlugins= [];
  pieChartColors= [
    {
      backgroundColor: ['rgba(255, 161, 181, 1)','rgba(134, 199, 243, 1)','rgba(255, 226, 154, 1)'],
    },
  ]; 

  barChartOptions: ChartOptions={
    responsive: true,
    scales:{xAxes:[{}], yAxes:[{}]},
  };
  barChartLabels: Label[]= []
  barChartType: ChartType= 'bar';
  barChartLegend= true;
  barChartPlugins= [];
  barChartData: ChartDataSets[]= [
    {data: [], label:''},
    {data: [], label:''},
    {data: [], label:''}
  ];
  
  lineChartData: ChartDataSets[]= [
    {data: [5, 10, 12, 16, 19, 21, 32], label: 'Total Deaths'},
    {data: [65, 75, 80, 85, 95, 100, 110], label: 'Total Recovered'},
    {data: [110, 140, 160, 195, 210, 220, 250], label: 'Total Cases'}
  ];
  lineChartLabels: Label[]= [];
  lineChartOptions: ChartOptions= {
    responsive: true
  };
  lineChartColors: Color[]= [
    {
      backgroundColor: 'rgba(255, 161, 181, 0.7)',
      borderColor: 'rgba(255, 161, 181, 1)'
    },
    {
      backgroundColor: 'rgba(134, 199, 243, 0.5)',
      borderColor: 'rgba(134, 199, 243, 1)'
    },
    {
      backgroundColor: 'rgba(255, 226, 154, 0.7)',
      borderColor: 'rgba(255, 226, 154, 1)'
    }
  ];
  lineChartLegend=true;
  lineChartType: ChartType= 'line';
  lineChartPlugins=[];
  
  constructor(public covidService: CovidService, private http: HttpClient, private route: ActivatedRoute, private location: Location, private datePipe: DatePipe) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    this.country1 = new Country();
    this.getAllData(); 
   }

  ngOnInit(): void {
    this.name = this.route.snapshot.params['id'];
    

    let date= new Date();
    this.datetampon= new Date();
    this.Date= this.datePipe.transform(date, 'dd MMM') || "";

    var arr_dates= new Array(9);
    for(let i=0; i<7 ; i++)
    {
      this.datetampon.setDate(this.datetampon.getDate()-1);
      arr_dates[i]= this.datePipe.transform(this.datetampon, 'dd MMM') || "";
    }
    
    this.Date1= arr_dates[0];
    this.Date2= arr_dates[1];
    this.Date3= arr_dates[2];;
    this.Date4= arr_dates[3];;
    this.Date5= arr_dates[4];
    this.Date6= arr_dates[5];
    this.Date7= arr_dates[6];
    
  }

  getAllData() {
     
    this.covidService.getData().subscribe(  
      async response => {  
        this.summary= response;
        
        for(let i in this.summary.Countries){

          if(this.summary.Countries[i].Slug == this.name){

            this.name1 = this.summary.Countries[i].Country;
            this.country= this.summary.Countries[i];
            await this.covidService.addCountryfirebase(this.country);
           
            this.covidService.getCountryfirebase(this.country.Slug).subscribe((data)=>
            {
              try{
                this.country1.Country= data!["country"];
                this.country1.NewConfirmed= data!["newconfirmed"];
                this.country1.NewDeaths= data!["newdeaths"];
                this.country1.NewRecovered= data!["newrecovered"];
                this.country1.Slug= data!["slug"];
                this.country1.TotalConfirmed= data!["totalconfirmed"];
                this.country1.TotalDeaths= data!["totaldeaths"];
                this.country1.TotalRecovered= data!["totalrecovered"];
                this.activeCases= this.country1.TotalConfirmed - this.country1.TotalRecovered;
            this.mortalityRate= Math.round((this.country1.TotalDeaths / this.country1.TotalConfirmed) * 10000)/100;
            this.recoveryRate= Math.round((this.country1.TotalRecovered / this.country1.TotalConfirmed) * 10000)/100;
            this.pieChartData= [this.country1.TotalDeaths, this.country1.TotalRecovered, this.country1.TotalConfirmed];
            this.pieChartLabels= ['Dead Cases', 'Recovered Cases', "Active Cases"];
            this.pieChartColors= [
              {
                backgroundColor: ['rgba(228, 114, 139, 1)','rgba(136, 172, 240, 1)','rgba(228, 207, 114, 1)'],
              },
            ];
                console.log(this.country1)
              }catch{
                this.getAllData();
              }
            });

            
            this.pieChartType= 'pie';
            this.pieChartLegend=true;
            this.pieChartPlugins= [];
            
            this.ncountry=this.country1.Country;
            this.getAllData2(); 
            this.getAllData3();
            
          }
        }   
      }         
    );

    
  }

  getAllData2() { 
    this.covidService.getDatacountry(this.name, "https://api.covid19api.com/country/").subscribe(
      response5 => {
        this.country= response5;
        let wfdeath: Array <number>=[];
        let wfrecovered: Array <number>=[];
        let wfconfirmed: Array <number>=[];

        let wdeath: Array <number>=[];
        let wrecovered: Array <number>=[];
        let wconfirmed: Array <number>=[];

        for(let j in response5){
          wdeath.push(response5[j].Deaths)
          wrecovered.push(response5[j].Recovered)
          wconfirmed.push(response5[j].Confirmed)
        }
        
        for(let i =0; i<7; i++){
          let x: number = wconfirmed[i+1] - wconfirmed[i];
          wfconfirmed.push(x);
          x = wrecovered[i+1] - wrecovered[i];
          wfrecovered.push(x);
          x = wdeath[i+1] - wdeath[i];
          wfdeath.push(x);

        }
        this.barChartLabels= [this.Date7,this.Date6,this.Date5,this.Date4,this.Date3,this.Date2,this.Date1]; 

        this.barChartData= [
          {data: wfdeath, label:'Daily Deaths'},
          {data: wfrecovered, label:'Daily Recovered'},
          {data: wfconfirmed, label:'Daily New Cases'}
        ];
      }
    );

  }

  getAllData3()
  {
    this.covidService.getDatacountryone(this.name, "https://api.covid19api.com/total/dayone/country/").subscribe(
      response6 => {
        let wdeath: Array <number> =[];
        let wrecovered: Array <number> =[];
        let wconfirmed: Array <number> =[];
        let wdate: Array <Label> =[];
        
        for(let i in response6){
          let x= response6[i].Confirmed;
          wconfirmed.push(x);
          x = response6[i].Recovered;
          wrecovered.push(x);
          x =  response6[i].Deaths;
          wdeath.push(x);
          x =  response6[i].Date;
          wdate.push(x);

        }

        this.lineChartData= [
          {data: wdeath, label:'Total Deaths'},
          {data: wrecovered, label:'Total Recovered'},
          {data: wconfirmed, label:'Total Cases'}
        ];

        var arr_dates= new Array();
        var arr_dates1= new Array();
        arr_dates= wdate;
        for(let i=0; i< wdate.length; i++)
        {
          arr_dates1[i]= this.datePipe.transform(arr_dates[i], 'dd MMM') || "";
        }
        this.lineChartLabels= arr_dates1;
       
      }
    );
  }
  addCountries(){
      
  }
}



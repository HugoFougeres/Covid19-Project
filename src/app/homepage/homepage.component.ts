import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { User } from '../user.model';

import {HttpClient} from '@angular/common/http';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country, Summary, World } from '../api.model';

import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color } from 'ng2-charts';
import { DatePipe } from '@angular/common';

  @Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css'],
    providers: [DatePipe]
  })

export class HomepageComponent implements OnInit {

  user: User;
  title = 'covid19-tracker';  
  summary: Summary; 
  world: World;
  country: Country;
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
    {data: [], label: 'Total Deaths'},
    {data: [], label: 'Total Recovered'},
    {data: [], label: 'Total Cases'}
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
  
  constructor(public covidService: CovidService, private http: HttpClient, private datePipe: DatePipe) { 
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
 }

  ngOnInit(): void {
    this.user= this.covidService.getUser();
    this.getAllData();
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
      response => {  
        this.summary= response;
        this.activeCases= this.summary.Global.TotalConfirmed - this.summary.Global.TotalRecovered;
        this.mortalityRate= Math.round((this.summary.Global.TotalDeaths / this.summary.Global.TotalConfirmed) * 10000)/100;
        this.recoveryRate= Math.round((this.summary.Global.TotalRecovered / this.summary.Global.TotalConfirmed) * 10000)/100;
        this.pieChartData= [this.summary.Global.TotalDeaths, this.summary.Global.TotalRecovered, this.summary.Global.TotalConfirmed];
        this.pieChartLabels= ['Dead Cases', 'Recovered Cases', "Active Cases"];
        this.pieChartColors= [
          {
            backgroundColor: ['rgba(228, 114, 139, 1)','rgba(136, 172, 240, 1)','rgba(228, 207, 114, 1)'],
          },
        ];
        this
        this.pieChartType= 'pie';
        this.pieChartLegend=true;
        this.pieChartPlugins= [];
        
      } 
    )

    this.covidService.getDatad().subscribe(
      response => {
        this.world= response;
        let wfdeath: Array <number>=[];
        let wfrecovered: Array <number>=[];
        let wfconfirmed: Array <number>=[];
        let wdeath: Array <number> =Object.values(response["deaths"]);
        let wrecovered: Array <number> =Object.values(response["recovered"]);
        let wconfirmed: Array <number> =Object.values(response["cases"]);
        
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
    )
    
    this.covidService.getDataw().subscribe(
      response => {
        this.world=response;
        let wdeath: Array <number> =Object.values(response["deaths"]);
        let wrecovered: Array <number> =Object.values(response["recovered"]);
        let wconfirmed: Array <number> =Object.values(response["cases"]);
        let wdate: Array <Label> =Object.keys(response["cases"]);

        this.lineChartData= [
          {data: wdeath, label:'Daily Deaths'},
          {data: wrecovered, label:'Daily Recovered'},
          {data: wconfirmed, label:'Daily New Cases'}
        ];

        var arr_dates= new Array();
        var arr_dates1= new Array();
        arr_dates= wdate;
        for(let i=0; i<wdate.length ; i++)
        {
          arr_dates1[i]= this.datePipe.transform(arr_dates[i], 'dd MMM') || "";
        }
        this.lineChartLabels= arr_dates1;
      }
    )

  }

  getSortDCases(){
    this.summary.Countries=this.summary.Countries.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);
  }
  getSortDRecovered(){
    this.summary.Countries=this.summary.Countries.sort((a, b) => b.TotalRecovered - a.TotalRecovered);
  }
  getSortDDeath(){
    this.summary.Countries=this.summary.Countries.sort((a, b) => b.TotalDeaths - a.TotalDeaths);
  }
  getSortDNDeath(){
    this.summary.Countries=this.summary.Countries.sort((a, b) => b.NewDeaths - a.NewDeaths);
  }
  getSortDNCases(){
    this.summary.Countries=this.summary.Countries.sort((a, b) => b.NewConfirmed - a.NewConfirmed);
  }
  getSortDNRecovered(){
    this.summary.Countries=this.summary.Countries.sort((a, b) => b.NewRecovered - a.NewRecovered);
  }
  getSortDCountry(){
    this.summary.Countries=this.summary.Countries.sort((a, b) => b.Country.localeCompare(a.Country));
  }
  

  getSortACases(){
    this.summary.Countries=this.summary.Countries.sort((a, b) => a.TotalConfirmed - b.TotalConfirmed);
  }
  getSortARecovered(){
    this.summary.Countries=this.summary.Countries.sort((a, b) => a.TotalRecovered - b.TotalRecovered);
  }
  getSortADeath(){
    this.summary.Countries=this.summary.Countries.sort((a, b) => a.TotalDeaths - b.TotalDeaths);
  }
  getSortANDeath(){
    this.summary.Countries=this.summary.Countries.sort((a, b) => a.NewDeaths - b.NewDeaths);
  }
  getSortANCases(){
    this.summary.Countries=this.summary.Countries.sort((a, b) => a.NewConfirmed - b.NewConfirmed);
  }
  getSortANRecovered(){
    this.summary.Countries=this.summary.Countries.sort((a, b) => a.NewRecovered - b.NewRecovered);
  }
  getSortACountry(){
    this.summary.Countries=this.summary.Countries.sort((a, b) => a.Country.localeCompare(b.Country));
  }

}

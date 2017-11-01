import {OnInit} from '@angular/core';
import {Dataset} from './datatypes';
import {ActivatedRoute} from '@angular/router';
import {DataParams} from "./data-params";
import {EconDataService} from './econ-data.service';


export class BaseViz implements OnInit {
  graphData:Dataset;
  years:number[] = [];
  countries:string[] = [];

  constructor(private route:ActivatedRoute,
              private econDataService:EconDataService) { }

  // A hook allowing subclasses to do something after the graph data is saved.
  protected handleNewData() { }

  private processData(data:Dataset) {
    if (!data) {
      return;
    }
    this.graphData = data;
    this.countries = Array.from(this.graphData.countryDataMap.keys()).sort();
    let firstCountryData = this.graphData.countryDataMap.values().next().value;
    if (firstCountryData) {
      let startYear = Number(firstCountryData.startYear);
      this.years = [];
      let numValues = firstCountryData.yearsValues.length;
      for (let i = 0; i < numValues; ++i) {
        this.years[i] = startYear + i;
      }
    }
    this.handleNewData();
  }

  ngOnInit(): void {
    // For component's pre-loaded data.
    this.route.data
      .map((data: {graphData: Dataset}) => data ? data.graphData : null)
      .subscribe(
        data => this.processData(data),
        err => { alert(err); }
      );

    // Query parameters change in the URL.
    this.route.queryParams.subscribe(qParams => {
      let dp:DataParams = DataParams.fromRawParams(qParams);

      this.econDataService.getGraphData(dp)
        .subscribe(
          data => this.processData(data),
          err => { alert(err); }
      );
    })
  }
}

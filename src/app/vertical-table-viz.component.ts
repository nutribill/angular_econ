/**
 * Display graph data as text in a table, one row per year.
 */

import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EconDataService} from './econ-data.service';
import {BaseViz} from './base-viz';

class YearData {
  year:number;
  countriesValues:number[];
  colorCodes:string[];
}

@Component({
  selector: 'vertical-table-viz',
  templateUrl: 'vertical-table-viz.component.html'
})
export class VerticalTableVizComponent extends BaseViz {

  constructor(route:ActivatedRoute, econDataService:EconDataService) {
    super(route, econDataService);
  }

  yearDataList():YearData[] {
    let colorCodes = this.countries.map(country =>
      this.graphData.countryDataMap.get(country).colorCode);

    let firstYear = this.years[0];
    return this.graphData ? this.years.map(year => {
      let yd = new YearData();
      yd.year = year;
      yd.colorCodes = colorCodes;
      let index = year-firstYear;

      yd.countriesValues = this.countries.map(country =>
        this.graphData.countryDataMap.get(country).yearsValues[index]);

      return yd;
    }) : [];

  }
}

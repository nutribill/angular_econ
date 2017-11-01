/**
 * Display graph data as text in a table, one row per country.
 */

import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EconDataService} from './econ-data.service';
import {BaseViz} from './base-viz';
import {CountryData} from './datatypes';


@Component({
  selector: 'table-viz',
  templateUrl: 'table-viz.component.html'
})
export class TableVizComponent extends BaseViz {

  constructor(route:ActivatedRoute, econDataService:EconDataService) {
    super(route, econDataService);
  }

  countryDataList():CountryData[] {
    return this.graphData ? Array.from(this.graphData.countryDataMap.values()) : [];
  }
}

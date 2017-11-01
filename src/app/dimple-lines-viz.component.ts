import {ElementRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {D3Service, D3, Selection} from 'd3-ng2-service';
import {EconDataService} from './econ-data.service';
import {Component} from '@angular/core';
import dimple from 'dimple';
import {DimpleBaseViz} from './dimple-base-viz';


@Component({
  selector: 'dimple-lines',
  template: `<svg width="100%" height="800"></svg>`
})
export class DimpleLinesVizComponent extends DimpleBaseViz  {

  constructor(element: ElementRef, d3Service: D3Service,
    route:ActivatedRoute, econDataService:EconDataService) {
    super(element, d3Service, route, econDataService);
  }

  protected customizeChart() {
    let xAxis = this.chart.addCategoryAxis("x", "Year");
    xAxis.addOrderRule(this.countries);
    let yAxis = this.chart.addMeasureAxis("y", this.datasetLabel);
    let countrySeries = this.chart.addSeries("Country", dimple.plot.line);

    countrySeries.addOrderRule(this.countries);
    this.addLegend(this.chart, countrySeries);
  }

}

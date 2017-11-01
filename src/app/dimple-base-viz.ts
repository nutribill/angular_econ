import {ElementRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EconDataService} from './econ-data.service';
import {D3Service, D3, Selection} from 'd3-ng2-service';
import dimple from 'dimple';
import {D3BaseViz} from './d3-base-viz';
import {datasets} from './remote-data-service';
import {CountryData} from "./datatypes";


export class DimpleBaseViz extends D3BaseViz  {
  chart;
  datasetLabel:string;

  constructor(element: ElementRef, d3Service: D3Service,
              route:ActivatedRoute, econDataService:EconDataService) {
    super(element, d3Service, route, econDataService);
  }

  protected handleNewData() {
    super.handleNewData();

    let d3Data = this.getD3Data();
    this.chart = new dimple.chart(this.svg, d3Data);
    this.chart.height = this.height * 0.75;
    this.chart.width = this.width * 0.75;
    this.assignColorsToChart();
    this.customizeChart();
    this.chart.draw();
  }

  protected customizeChart() {}

  protected addLegend(chart, series) {
    this.chart.addLegend(this.width * 0.9, 10, 50, 120, "right", series);
  }

  protected getD3Data(): Array<Object> {
    let dataForD3 = [];
    this.datasetLabel = datasets.get(this.graphData.dataset).datasetLabel;

    this.graphData.countryDataMap.forEach((countryData:CountryData, country:string) => {
      for (let i=0; i<countryData.yearsValues.length; ++i) {
        let row = {
          'Country': country,
          'Year': countryData.startYear + i,
        };
        row[this.datasetLabel] = countryData.yearsValues[i];
        dataForD3.push(row);
      }
    });

    return dataForD3;
  }

  private assignColorsToChart(): void {
    this.colorMap.forEach((colorCode, country) => {
      this.chart.assignColor(country, colorCode);
    });
  }

}

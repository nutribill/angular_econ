import {Component} from '@angular/core';
import {DatasetInfo} from './datatypes';
import {datasets} from './remote-data-service';
import {ActivatedRoute, Router} from '@angular/router';
import {AppNavigator} from './app-navigator';
import {ParamComponent} from './param-component';


function getRange(start:number, end:number) {
  let range = [];
  for (let i = start; i <= end; i += 1) {
    range.push(i);
  }
  return range;
}


@Component({
  selector: 'dataset-and-year-selector',
  templateUrl: './dataset-and-year-selector.component.html'
})
export class DatasetAndYearSelectorComponent extends ParamComponent {
  selectedDataset:string;
  startYear:number;
  endYear:number;

  datasets:Array<DatasetInfo>;

  public startYearsRange:number[];
  public endYearsRange:number[];

  constructor(router: Router,
              activatedRoute:ActivatedRoute,
              private appNavigator:AppNavigator) {
    super(router, activatedRoute);
    this.datasets = Array.from(datasets.values());
  }

  protected setParams(qParams) {
    if (qParams.dataset) {
      this.selectedDataset = qParams.dataset;
      if (qParams.startYear) {
        this.startYear = Number(qParams.startYear);
      }
      if (qParams.endYear) {
        this.endYear = Number(qParams.endYear);
      }
    }
    else {
      this.resetForError();
    }

    if (this.selectedDataset && this.startYear && this.endYear) {
      this.setYearsRanges();
    }
  }

  protected resetForError() {
    this.selectedDataset = null;
    this.startYear = null;
    this.endYear = null;
    this.startYearsRange = [];
    this.endYearsRange = [];
  }

  private setYearsRanges():void {
    let currDataset = this.currentDataset();
    this.startYearsRange = getRange(Number(currDataset.dataMinYear), Number(this.endYear));
    this.endYearsRange = getRange(Number(this.startYear), Number(currDataset.dataMaxYear));
  }

  private currentDataset(): DatasetInfo {
    return this.datasets.filter(ds => ds.dataset == this.selectedDataset)[0];
  }

  public updateDataset(): Promise<any> {
    let currDataset = this.currentDataset();

    this.selectedDataset = currDataset.dataset;
    this.startYear = currDataset.dataMinYear;
    this.endYear = currDataset.dataMaxYear;

    return this.updateYears();
  }

  public updateYears(): Promise<any> {
    this.setYearsRanges();
    return this.appNavigator.navigateDatasetAndYearsChange(
        this.selectedDataset, this.startYear, this.endYear);
  }
}

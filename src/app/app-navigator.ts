import {Injectable} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {DatasetInfo} from './datatypes';
import {DataParams} from './data-params';
import {datasets, allCountries} from './remote-data-service';


const PARAMS_INCOMPLETE_PATH = 'params-selector';
const DEFAULT_FORMAT = 'table';

export let graphFormatFromUrl = function(url:string):string {
  if (!url) {
    return null;
  }
  let format = url.substring(1).split('?')[0];
  return (format == PARAMS_INCOMPLETE_PATH || format == '') ? null : format;
};

export const FORMATS = [
  ['table', 'Text Table'],
  ['vertical-table', 'Vertical Text Table'],
  ['dimple-lines', 'Dimple Lines'],
  ['dimple-barchart', 'Dimple Barchart'],
];


let formatIsValid = function(format:string) : boolean {
  return format == null || FORMATS.some(fmt => fmt[0] == format);
};


@Injectable()
export class AppNavigator {

  currentFormat:string;
  currentParams:DataParams;

  // for reference
  datasets:Map<string,DatasetInfo>;
  validCountries:Set<string>;

  constructor(private router: Router) {

    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.currentParams = DataParams.fromUrl(event.url);
          this.currentFormat = graphFormatFromUrl(event.url);

          if ((!this.currentParams.areValid(datasets, this.validCountries)) ||
              !formatIsValid(this.currentFormat)) {
            return this.error404();
          }
        }
      });

    this.datasets = datasets;
    this.validCountries = new Set(allCountries);
  }

  private navigate(format:string, newParams:DataParams): Promise<any> {
    return this.router.navigate([format], newParams.prepForNavigation());
  }

  private error404(): Promise<any> {
    this.currentParams = new DataParams();
    this.currentFormat = null;
    return this.router.navigate([PARAMS_INCOMPLETE_PATH], { queryParams: {error404: true}})
  }

  private handleErrors(newParams:DataParams): Promise<any> {
    if (!newParams.areComplete()) {
      return this.navigate(PARAMS_INCOMPLETE_PATH, newParams);
    }

    if (!newParams.areValid(this.datasets, this.validCountries)) {
      return this.error404();
    }
    return null;
  }

  public navigateDatasetAndYearsChange(dataset:string, startYear:number, endYear:number)
        : Promise<any>{
    let newParams = new DataParams();
    newParams.countries = this.currentParams.countries;
    newParams.dataset = dataset;
    newParams.startYear = startYear;
    newParams.endYear = endYear;

    return this.handleErrors(newParams) ||
        this.navigate(this.currentFormat || DEFAULT_FORMAT, newParams);
  }

  public navigateCountriesChange(countries:string[]): Promise<any> {
    let newParams = new DataParams();
    newParams.dataset = this.currentParams.dataset;
    newParams.startYear = this.currentParams.startYear;
    newParams.endYear = this.currentParams.endYear;
    newParams.countries = countries;

    return this.handleErrors(newParams) ||
        this.navigate(this.currentFormat || DEFAULT_FORMAT, newParams);
  }

  public navigateFormatChange(newFormat:string) : Promise<any> {
    return this.handleErrors(this.currentParams) || this.navigate(newFormat, this.currentParams);
  }

}

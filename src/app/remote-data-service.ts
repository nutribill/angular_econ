import {Http} from '@angular/http';
import {Observable} from 'rxjs';
import {DatasetInfo} from "./datatypes";
import {Injectable} from "@angular/core";


const BASE_URL = 'http://localhost:3000/';

export let allCountries:string[];
export let datasets:Map<string,DatasetInfo>;


export let initAllCountries = function(http:Http) {
  return () => {

    let zz = http.get(BASE_URL + 'countries');

    //return http.get(BASE_URL + 'countries')
    return zz
      .map(resp => {
        let rows = JSON.parse(resp.text());
        return rows.map(row => row['country']);
      })
      .do(countries => {
        allCountries = countries;
      })
      .toPromise();
  };
};


export let initDatasetsInfo = function(http:Http) {
  return () => {
    return http.get(BASE_URL + 'datasets')
      .map(resp => {
        let rows = JSON.parse(resp.text());
        return rows.map(row => {
          let di = new DatasetInfo();
          di.dataset = row['dataset'];
          di.datasetLabel = row['dataset_label'];
          di.dataMinYear = row['min_year'];
          di.dataMaxYear = row['max_year'];
          return di;
        })
      })
      .do(di => {
        datasets = new Map();
        for (let ds of di) {
          datasets.set(ds.dataset, ds);
        }
      })
      .toPromise();
  }
};


@Injectable()
export class RemoteDataService {

  constructor(private http: Http) {}

  /**
   *
   * @param dataset Current dataset whose data is to be displayed.
   * @param countries List of countries for which to fetch the data.
   * @returns observable for fetched dataset rows
   */
  public fetchDatasetRows(dataset: string, countries: string[]): Observable<any[]>{
    let query = 'dataset=eq.' + dataset + '&country' +
      (countries.length == 1 ? '=eq.' + countries[0] : '=in.' + countries.join(','));
    let url = BASE_URL + 'econ_data?' + encodeURI(query);
    return this.http.get(url)
      .map(resp => JSON.parse(resp.text()));
  }
}

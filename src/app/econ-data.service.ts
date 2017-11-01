/*
All the visualizations of data show a range of years for a set of countries for a data dataset.
The interface allows any of these factors to change, required the visualizations to be updated
as the selection of data changes.
*/
import {Injectable} from "@angular/core";
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

import {RemoteDataService} from './remote-data-service';
import {Dataset, CountryData} from './datatypes';
import {DataParams} from './data-params';
import {CountryColorMap, generateColorMap} from './country-color-mapper';


@Injectable()
export class EconDataService {
  // All data that is fetched is cached, but maybe only a part of it is displayed at any given time.
  // All years are always fetched, even though the data made accessible via the observable is
  // restricted by year range.
  // Color code is null in the cache since colors are reassigned every time the countries list changes.
  private cachedData: Map<string, Dataset> = new Map();

  constructor(private remoteDataService: RemoteDataService) { }

  /**
   * @returns {Array<string>} list of countries selected minus countries
   * whose data is already fetched.
   */
  private countriesToFetch(dataset: string, countries: string[]): string[] {
    let countriesToFetch = new Set(countries);

    // Remove from list countries whose data is already fetched:
    if (this.cachedData.has(dataset)) {
      let cdMap = this.cachedData.get(dataset).countryDataMap;
      for (let country of Array.from(cdMap.keys())) {
        countriesToFetch.delete(country);
      }
    }
    return Array.from(countriesToFetch);
  }

  /**
   * Convert dataset rows into arrays of values for each country.
   * The name of the column containing the numerical data will vary by dataset.
   *
   * @param rawData rows from the database
   * @param countriesFetched list of countries whose data was fetched
   * @returns {Map<string, CountryData>}
   */
  private static condenseRawData(rawData, countriesFetched:Array<string>): Map<string, CountryData> {
    let outputMap = new Map<string, CountryData>();
    for (let country of countriesFetched) {
      outputMap.set(country, null);
    }
    if (!rawData || rawData.length == 0) return outputMap;

    let countryRowsMap = new Map<string, Array<any>>();
    for (let row of rawData) {
      if (!countryRowsMap.has(row.country)) {
        countryRowsMap.set(row.country, []);
      }
      countryRowsMap.get(row.country).push(row);
    }

    for (let country of Array.from(countryRowsMap.keys())) {
      let countryRows = countryRowsMap.get(country);
      countryRows.sort((a, b) => a.year > b.year ? 1 : -1);

      let countryData = new CountryData();
      countryData.country = country;
      countryData.startYear = countryRows[0].year;
      countryData.yearsValues = countryRows.map(row => row['datum']);
      outputMap.set(country, countryData);
    }
    return outputMap;
  };

  private getYearsValues(inCountryData: CountryData, startYear: number, endYear: number) :
      Array<number> {
    let yearsValues: Array<number> = Array(endYear - startYear + 1).fill(null);

    if (inCountryData != null) {
      let toOffset = inCountryData.startYear - startYear;
      let fromOffset = 0;
      if (toOffset < 0) {
        fromOffset = -toOffset;
        toOffset = 0;
      }

      let copyLen =
        Math.min(endYear, inCountryData.startYear + inCountryData.yearsValues.length - 1)
        - Math.max(startYear, inCountryData.startYear) + 1;

      if (copyLen > 0) {
        let copyValues = inCountryData.yearsValues.slice(fromOffset, fromOffset + copyLen);
        yearsValues.splice(toOffset, copyLen, ...copyValues);
      }
    }

    return yearsValues;
  }

  /**
   * Extract from the cache data for the currently selected dataset and countries,
   * subsetted to the currently selected years range.
   * @returns {Dataset} data for display
   */
  private extractGraphData(dataset:string, countries:string[],
                           startYear:number, endYear:number): Dataset {
    let cachedCountryDataMap = this.cachedData.get(dataset).countryDataMap;
    let outDataset = new Dataset();
    outDataset.dataset = dataset;
    outDataset.countryDataMap = new Map<string,CountryData>();

    let countryColorMap:CountryColorMap = generateColorMap(countries);

    for (let country of countries) {
      let inCountryData = cachedCountryDataMap.get(country);

      let outCountryData = new CountryData();
      outCountryData.country = country;
      outCountryData.colorCode = countryColorMap.get(country);
      outCountryData.startYear = startYear;
      outCountryData.yearsValues = this.getYearsValues(inCountryData, startYear, endYear);
      outDataset.countryDataMap.set(country, outCountryData);
    }
    return outDataset;
  }

  /**
   * Fetch data for graphical display.
   * @param dataParams  parameters specifying which data to display
   * @returns {Observable<Dataset>} data to display
   */
  public getGraphData(dataParams: DataParams): Observable<Dataset> {

    let countriesToFetch = this.countriesToFetch(dataParams.dataset, dataParams.countries);

    // Start with an observable for the newly fetched data (which could be empty).
    let fetchedData: Observable<Map<string, CountryData>> =
      countriesToFetch ?
      this.remoteDataService.fetchDatasetRows(dataParams.dataset, countriesToFetch)
        .map(rawData => EconDataService.condenseRawData(rawData, countriesToFetch)) :
        Observable.of(new Map<string,CountryData>()); // empty

    return fetchedData
      .do(countryDataMap => {   // Save the newly fetched data to the cache
          let datasetData = new Dataset();
          datasetData.dataset = dataParams.dataset; //  dataset;

          if (this.cachedData.has(datasetData.dataset)) {
            let cd = this.cachedData.get(datasetData.dataset).countryDataMap;
            countryDataMap.forEach((countryData:CountryData, country:string) => {
              cd.set(country, countryData);
            });
            datasetData.countryDataMap = cd;
          }
          else {
            datasetData.countryDataMap = countryDataMap;
          }
          this.cachedData.set(datasetData.dataset, datasetData);
        }
      )
      .map(() => {   // Extract selected data from the cache
        return this.extractGraphData(dataParams.dataset, dataParams.countries, dataParams.startYear,
          dataParams.endYear);
      });
  }

}

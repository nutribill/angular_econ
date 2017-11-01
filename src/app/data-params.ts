import {Params, NavigationExtras} from '@angular/router';
import {DatasetInfo} from './datatypes';
import {Injectable} from "@angular/core";

@Injectable()
export class DataParams {
  dataset:string;
  countries:string[];
  startYear:number;
  endYear:number;

  constructor() {
    this.dataset = null;
    this.startYear = null;
    this.endYear = null;
    this.countries = [];
  }

  /**
   * Are the parameters complete, sufficient to fetch graph data?
   * @returns {Boolean}
   */
  public areComplete():boolean {
    return Boolean(this.dataset && this.countries && this.countries.length > 0 &&
      this.startYear && this.endYear);
  }

  /**
   * Are there any invalid parameters?
   * The front end app would never produce invalid parameters; that could only happen
   * with a URL generated elsewhere and passed to the app.
   *
   * Parameters are not assumed to be complete. Check those that are present.
   * @returns {Boolean}
   */
  public areValid(datasets:Map<string,DatasetInfo>, validCountries:Set<string>):boolean {
    if (this.countries.length > 0) {
      return this.countries.every(country => validCountries.has(country));
    }

    if (this.dataset) {
      if (!datasets.has(this.dataset)) {
        return false;
      }
      let ds = datasets.get(this.dataset);
      return ds.dataMinYear <= this.startYear && ds.dataMaxYear >= this.endYear;
    }

    return true;
  }

  /**
   * Assemble the parameters as required for navigating to a new URL.
   * @returns {{queryParams: {dataset: string, countries: string, startYear: String, endYear: String}}}
   */
  public prepForNavigation(): NavigationExtras {
    let qp = {};
    if (this.dataset) {
      qp['dataset'] = this.dataset;
    }
    if (this.countries && this.countries.length > 0) {
      qp['countries'] = this.countries.join();
    }
    if (this.startYear) {
      qp['startYear'] = String(this.startYear);
    }
    if (this.endYear) {
      qp['endYear'] = String(this.endYear);
    }
    return { queryParams: qp };
  }

  static fromRawParams(rawParams:Params):DataParams {
    let dp:DataParams = new DataParams();
    let rParams = rawParams.valueOf();
    if (rParams['dataset']) {
      dp.dataset = rParams['dataset'];
    }
    if (rParams['startYear']) {
      dp.startYear = Number(rParams['startYear']);
    }
    if (rParams['endYear']) {
      dp.endYear = Number(rParams['endYear']);
    }
    if (rParams['countries']) {
      dp.countries = decodeURI(rParams['countries']).split(',');
    }

    return dp;
  }

  static fromUrl(url:string):DataParams {
    let dp: DataParams = new DataParams();

    let urlParts = url.split('?');
    if (urlParts.length <= 1) {
      return dp;
    }
    let queryParts = urlParts[1].split('&');
    for (let qp of queryParts) {
      let [key, val] = qp.split('=');
      if (val) {
        switch (key) {
          case 'dataset': {
            dp[key] = val;
            break;
          }

          case 'startYear':
          case 'endYear': {
            dp[key] = Number(val);
            break;
          }

          case 'countries': {
            dp[key] = decodeURI(val).split(',');
            break;
          }

          default: {
            // do nothing
          }
        }
      }
    }
    return dp;
  }
}

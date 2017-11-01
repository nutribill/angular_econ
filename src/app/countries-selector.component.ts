import {Component} from '@angular/core';
import {CompleterItem} from 'ng2-completer';
import {allCountries} from './remote-data-service';
import {generateColorMap, COLOR_PALLETTE} from './country-color-mapper';
import {ActivatedRoute, Router} from '@angular/router';
import {AppNavigator} from './app-navigator';
import {ParamComponent} from './param-component';


@Component({
  selector: 'countries-selector',
  templateUrl: './countries-selector.component.html',
  styleUrls: ['./countries-selector.component.css']
})
export class CountriesSelectorComponent extends ParamComponent { // implements OnInit {
  countries:string[] = [];

  constructor(router: Router,
              activatedRoute:ActivatedRoute,
              private appNavigator:AppNavigator,) {
    super(router, activatedRoute);
  }

  protected setParams(qParams) {
    this.countries = qParams.countries ? decodeURI(qParams.countries).split(',') : [];
  }

  protected resetForError() {
    this.countries = [];
  }

  public countryColorPairs(): Array<Array<string>> {
    let map = generateColorMap(this.countries);
    return Array.from(map.entries()).sort((a,b) => a[0] > b[0] ? 1 : -1);
  }

  public colorsAllTaken():boolean {
    return this.countries && this.countries.length == COLOR_PALLETTE.length;
  }

  public colorMapEmpty():boolean {
    return !this.countries;
  }

  public unusedCountries():string[] {
    return allCountries.filter(country => this.countries.indexOf(country) == -1);
  }

  public deleteCountry(country: string):Promise<any> {
    let pos = this.countries.indexOf(country);
    this.countries.splice(pos, 1);
    return this.appNavigator.navigateCountriesChange(this.countries);
  }

  public onCountrySelect(item: CompleterItem):Promise<any> {
    if (item) {
      this.countries.push(item.title);
      this.countries.sort();
      return this.appNavigator.navigateCountriesChange(this.countries);
    }
    else {
      return null;
    }
  }
}

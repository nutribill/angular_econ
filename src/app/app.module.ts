import { BrowserModule } from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {RouterModule, Routes}   from '@angular/router';
import {Http} from '@angular/http';
import {Ng2CompleterModule} from "ng2-completer";

import {AppComponent} from './app.component';
import {EconDataService} from './econ-data.service';
import {RemoteDataService, initAllCountries, initDatasetsInfo} from './remote-data-service';
import {CountriesSelectorComponent} from './countries-selector.component';
import {TableVizComponent} from './table-viz.component';
import {DimpleLinesVizComponent} from './dimple-lines-viz.component';
import {DimpleBarchartVizComponent} from './dimple-barchart-viz.component';
import {D3TestVizComponent} from './d3-test-viz';
import {VerticalTableVizComponent} from './vertical-table-viz.component';
import {DatasetAndYearSelectorComponent} from './dataset-and-year-selector.component';
import {YearAbbrev} from './year-abbrev';
import {AppNavigator} from './app-navigator';
import {FormatSelectorComponent} from './format-selector.component';
import {ParamsSelectorComponent} from './params-selector.component';
import {DataResolver} from "./data-resolver";

import { D3Service } from 'd3-ng2-service';


let ROUTES: Routes = [
  {
    path: 'table',
    component: TableVizComponent,
    resolve: { graphData: DataResolver }
  },
  {
    path: 'vertical-table',
    component: VerticalTableVizComponent,
    resolve: { graphData: DataResolver }
  },
  {
    path: 'dimple-lines',
    component: DimpleLinesVizComponent,
    resolve: { graphData: DataResolver }
  },
  {
    path: 'dimple-barchart',
    component: DimpleBarchartVizComponent,
    resolve: { graphData: DataResolver }
  },
  {
    path: 'd3-test',
    component: D3TestVizComponent,
    resolve: { graphData: DataResolver }
  },
  {
    path: '',
    redirectTo: 'params-selector',
    pathMatch: 'full',
  },
  {
    path: 'params-selector',
    component: ParamsSelectorComponent
  },
];

@NgModule({
  declarations: [
    AppComponent, CountriesSelectorComponent, TableVizComponent, VerticalTableVizComponent,
    DimpleLinesVizComponent, D3TestVizComponent, DimpleBarchartVizComponent,
    FormatSelectorComponent,
    ParamsSelectorComponent, DatasetAndYearSelectorComponent, YearAbbrev
  ],
  imports: [
    BrowserModule, Ng2CompleterModule, FormsModule,
    RouterModule.forRoot(ROUTES, {useHash: true})
  ],
  providers: [D3Service, EconDataService, RemoteDataService, AppNavigator, DataResolver,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {
      provide: APP_INITIALIZER,
      useFactory: initDatasetsInfo,
      multi: true,
      deps: [Http]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initAllCountries,
      multi: true,
      deps: [Http]
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

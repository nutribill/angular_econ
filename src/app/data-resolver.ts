import {ActivatedRouteSnapshot, RouterStateSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {DataParams} from './data-params';
import {EconDataService} from './econ-data.service';
import {Injectable} from "@angular/core";


@Injectable()
export class DataResolver implements Resolve<any> {

  constructor(private econDataService:EconDataService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let dp:DataParams = DataParams.fromRawParams(route.queryParams);

    return this.econDataService.getGraphData(dp).take(1);
  }
}

import {ElementRef, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EconDataService} from './econ-data.service';
import {BaseViz} from './base-viz';
import {D3Service, D3} from 'd3-ng2-service';
import {CountryColorMap, generateColorMap} from './country-color-mapper';


export class D3BaseViz extends BaseViz implements OnDestroy {
  private d3: D3;
  private parentNativeElement: any;
  svg;
  height:number;
  width:number;
  colorMap: CountryColorMap;

  constructor(element: ElementRef, d3Service: D3Service,
              route:ActivatedRoute, econDataService:EconDataService) {
    super(route, econDataService);
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  protected handleNewData() {

    this.d3.select('svg').selectAll('*').remove();
    this.colorMap = generateColorMap(this.countries);
  }

  ngOnInit() {
    if (this.parentNativeElement !== null) {
      // if (this.svg) {
      //   this.svg.remove();
      // }

      let d3ParentElement = this.d3.select(this.parentNativeElement);
      this.svg = d3ParentElement.select<SVGSVGElement>('svg');

      let svg_group = this.svg._groups[0][0];
      this.height = svg_group.clientHeight;
      this.width = svg_group.clientWidth;
    }

    super.ngOnInit();
  }

  ngOnDestroy() {
    this.svg.remove();
  }
}

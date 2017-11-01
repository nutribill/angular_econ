import {ElementRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {D3Service, D3, Selection} from 'd3-ng2-service';
import {EconDataService} from './econ-data.service';
import {Component} from '@angular/core';
import {D3BaseViz} from './d3-base-viz';


@Component({
  selector: 'd3-test',
  template: '<svg></svg>'
})
export class D3TestVizComponent extends D3BaseViz {

  constructor(element: ElementRef, d3Service: D3Service,
              route: ActivatedRoute, econDataService: EconDataService) {
    super(element, d3Service, route, econDataService);
  }

  protected handleChangedData() {
    super.handleNewData();

    this.svg.append("circle")
      .style("stroke", "gray")
      .style("fill", "white")
      .attr("r", 40)
      .attr("cx", 50)
      .attr("cy", 50)
      .on("mouseover", function(){this.d3.select(this).style("fill", "aliceblue");})
      .on("mouseout", function(){this.d3.select(this).style("fill", "white");});

  }
}

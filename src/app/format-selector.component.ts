import {Component, OnInit} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {AppNavigator, graphFormatFromUrl, FORMATS} from './app-navigator';


@Component({
  selector: 'format-selector',
  template: `
    <div *ngIf="!hideIt" class=".container" style="margin:10px">
      <div *ngFor="let format of formats">
        <input type="radio"
           (change)="handleChange()"
           value="{{format[0]}}" name="selectedFormat" [(ngModel)]="selectedFormat" 
           [checked]="isSelected(format[0])"/>
        <label>{{format[1]}}</label>
      </div>
    </div>
  `
})
export class FormatSelectorComponent implements OnInit {
  hideIt:boolean;
  selectedFormat:string;
  readonly formats = FORMATS;

  constructor(private appNavigator:AppNavigator, private router:Router) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url.length == 0) {
          this.hideIt = true;
        }
        else {
          let format = graphFormatFromUrl(event.url);
          this.hideIt = format == null || format == 'params-selector';
          if (!this.hideIt) {
            this.selectedFormat = format;
          }
        }
      }
    });
  }

  isSelected(format:string): boolean {
    return this.selectedFormat == format;
  }

  handleChange(): void {
    this.appNavigator.navigateFormatChange(this.selectedFormat);
  }

}

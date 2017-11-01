import {OnInit} from '@angular/core';
import {ActivatedRoute, Router, NavigationStart} from '@angular/router';


export class ParamComponent implements OnInit {
  constructor(protected router: Router,
              protected activatedRoute:ActivatedRoute) { }

  protected setParams(qParams) { }
  protected resetForError() { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap
      .subscribe(qpMap => {
        this.setParams(qpMap['params']);
      });

    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          if (event.url.includes('?error404')) {
            this.resetForError();
          }
        }
      });
  }
}

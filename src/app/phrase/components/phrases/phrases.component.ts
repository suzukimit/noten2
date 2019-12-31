import {Component, Input} from '@angular/core';
import {Phrase} from '../../models/phrase';
import {AbstractComponent} from '../../../common/abstract.component';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute, Router} from '@angular/router';
import {AppState} from '../../../common/index';


@Component({
  selector: 'phrases',
  templateUrl: './phrases.component.html',
  styleUrls: ['./phrases.component.scss']
})
export class PhrasesComponent extends AbstractComponent {
  @Input() phrases$: Observable<Phrase[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }
}

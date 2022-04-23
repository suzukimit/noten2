import {Component, Input} from '@angular/core';
import {Phrase} from '../../models/phrase';
import {AbstractComponent} from '../../../common/abstract.component';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute, Router} from '@angular/router';
import {AppState} from '../../../common/index';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from '../../../common/modal/modal.component';
import {DeletePhrase} from '../../actions/phrase.action';
import {faTrash} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'phrases',
  templateUrl: './phrases.component.html',
  styleUrls: ['./phrases.component.scss']
})
export class PhrasesComponent extends AbstractComponent {
  @Input() phrases$: Observable<Phrase[]>;
  faTrash = faTrash;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  delete(phrase: Phrase) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.headerContent = "Delete";
    modalRef.componentInstance.bodyContent = "Are you sure?";
    modalRef.result.then(
      (result) => {
        this.store.dispatch(new DeletePhrase({id: phrase.id.toString()}));
      },
      (reason) => {}
    );
  }
}

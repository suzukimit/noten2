import {Component} from '@angular/core';
import {Phrase} from '../phrase/models/phrase';
import {select, Store} from '@ngrx/store';
import {CreatePhrase, LoadPhrases} from '../phrase/actions/phrase.action';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppState} from '../common/index';
import {ActivatedRoute} from '@angular/router';
import {AbstractComponent} from '../common/abstract.component';
import {NotebooksComponent} from '../notebook/components/notebooks/notebooks.component';
import {Logout} from '../auth/actions/auth.actions';
import {findPhrases} from '../phrase/actions/find-phrase.actions';
import {Observable} from 'rxjs';
import {getFindResults} from '../phrase/reducers/find-phrase.reducer';
import {getPhrases} from '../phrase/reducers/phrase.reducer';
import {LoadNotebooks} from '../notebook/actions/notebook.action';
import {faBook, faMusic, faPlus, faSearch, faSignOut, faTags, faWrench} from '@fortawesome/free-solid-svg-icons';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class Home extends AbstractComponent {
  public isCollapsed = true;
  public closeResult = '';
  public phrases$: Observable<Phrase[]>;
  public faMusic = faMusic;
  public faPlus = faPlus;
  public faBook = faBook;
  public faTags = faTags;
  public faSearch = faSearch;
  public faSettings = faWrench;
  public faLogout = faSignOut;

  constructor(
    private store: Store<AppState>,
    private modalService: NgbModal,
    private router: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      // TODO notebookで絞る
    );

    this.store.dispatch(new LoadPhrases());
    this.store.dispatch(new LoadNotebooks());
    this.phrases$ = Observable.merge(
      this.store.pipe(select(getPhrases)),
      this.store.pipe(select(getFindResults))
    ).filter(phrases => phrases.length > 0);
  }

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }

  createPhrase() {
    this.store.dispatch(new CreatePhrase({phrase: Phrase.createDefault()}));
  }

  logout() {
    this.store.dispatch(new Logout());
  }

  search(query: string) {
    this.store.dispatch(findPhrases({ query }));
  }

  openNotebook() {
    this.modalService.open(NotebooksComponent).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}

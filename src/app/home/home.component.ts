import {Component} from '@angular/core';
import {Phrase} from '../phrase/models/phrase';
import {Store} from '@ngrx/store';
import {CreatePhrase} from '../phrase/actions/phrase.action';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppState} from '../common/index';
import {ActivatedRoute} from '@angular/router';
import {AbstractComponent} from '../common/abstract.component';
import {NotebooksComponent} from '../notebook/components/notebooks/notebooks.component';
import {Logout} from '../auth/actions/auth.actions';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class Home extends AbstractComponent {
  public isCollapsed = true;
  public closeResult = '';

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
      this.router.queryParams.subscribe(val => console.log(val))
    );
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

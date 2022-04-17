import {Component, ElementRef, ViewChild} from '@angular/core';
import {keys, lengths, meters, Phrase} from '../../models/phrase';
import {AbstractComponent} from '../../../common/abstract.component';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {getPhrase, PhraseState} from '../../reducers/phrase.reducer';
import {DeletePhrase, LoadPhrase, UpdatePhrase} from '../../actions/phrase.action';
import {Notebook} from '../../../notebook/models/notebook';
import {getNotebooks} from '../../../notebook/reducers/notebook.reducer';

@Component({
  selector: 'phrase',
  templateUrl: './phrase.component.html',
  styleUrls: ['./phrase.component.scss']
})
export class PhraseComponent extends AbstractComponent {
  phrase$: Observable<Phrase>;
  phrase: Phrase = null;
  notebooks$: Observable<Notebook[]>;
  notebooks: Notebook[] = [];
  phraseForm: FormGroup;
  keys = keys;
  lengths = lengths;
  meters = meters;
  @ViewChild('abc', {static: true}) abcArea: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private store: Store<PhraseState>,
  ) {
    super();
    this.createForm();
  }

  ngOnInit() {
    super.ngOnInit();
    new ABCJS.Editor('abc', { paper_id: 'paper0', warnings_id: 'warnings' });
    this.phrase$ = this.store.select(getPhrase);
    this.notebooks$ = this.store.select(getNotebooks);

    this.subscriptions.push(
      this.route.paramMap.subscribe(this.onLoad.bind(this)),
      this.phrase$.subscribe(this.onSelectPhrase.bind(this)),
      this.notebooks$.subscribe(this.onSelectNotebooks.bind(this))
    );
  }

  onLoad(params: ParamMap) {
    this.store.dispatch(new LoadPhrase(+params.get('id')));
  }

  onSelectPhrase(phrase: Phrase) {
    this.phrase = Object.assign(new Phrase(), phrase);

    this.rebuildForm();
    this.updatePaper();

    this.phraseForm.valueChanges.forEach(
      (value: string) => {
        this.updatePaper();
      }
    );
  }

  onSelectNotebooks(notebooks: Notebook[]) {
    this.notebooks = notebooks.map(notebook => Object.assign(new Notebook(), notebook));
  }

  notebookNames() {
    return this.notebooks.map(n => n.name);
  }

  save() {
    this.phrase = this.prepareSave();
    this.store.dispatch(new UpdatePhrase({phrase: this.phrase}));
  }

  delete() {
    this.store.dispatch(new DeletePhrase({id: this.phrase.id.toString()}));
  }

  private createForm() {
    this.phraseForm = this.fb.group({
      title: ['', Validators.required],
      meter: ['', Validators.required],
      length: ['', Validators.required],
      reference: '',
      key: ['', Validators.required],
      abc: ['', Validators.required],
      notebook: ['', Validators.required],
    });
  }

  private rebuildForm() {
    this.phraseForm.reset({
      title: this.phrase.title,
      meter: this.phrase.meter,
      length: this.phrase.length,
      reference: this.phrase.reference,
      key: this.phrase.key,
      abc: this.phrase.abc,
      notebook: this.phrase.notebook,
    });
  }

  private prepareSave(): Phrase {
    const formModel = this.phraseForm.value;
    return Object.assign(new Phrase(), {
      id: this.phrase.id,
      title: formModel.title as string,
      meter: formModel.meter as string,
      length: formModel.length as string,
      reference: formModel.reference as string,
      key: formModel.key as string,
      abc: formModel.abc as string,
    });
  }

  private updatePaper() {
    this.phrase = this.prepareSave();
    this.abcArea.nativeElement.value = this.phrase.toString();
    this.abcArea.nativeElement.dispatchEvent(new Event('change'));
  }
}

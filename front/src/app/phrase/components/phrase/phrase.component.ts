import {Component, ElementRef, ViewChild} from '@angular/core';
import {keys, lengths, meters, Phrase} from '../../models/phrase';
import {AbstractComponent} from '../../../common/abstract.component';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {getPhrase, PhraseState} from '../../reducers/phrase.reducer';
import {LoadPhrase, UpdatePhrase} from '../../actions/phrase.action';
import {Notebook} from '../../../notebook/models/notebook';
import {getNotebooks} from '../../../notebook/reducers/notebook.reducer';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'phrase',
  templateUrl: './phrase.component.html',
  styleUrls: ['./phrase.component.scss']
})
export class PhraseComponent extends AbstractComponent {
  phrase$: Observable<Phrase>;
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
    new ABCJS.Editor('abc', { paper_id: 'paper0', warnings_id: 'warnings', abcjsParams: {
        responsive: "resize"
      },
    });
    this.phrase$ = this.store.select(getPhrase);
    this.notebooks$ = this.store.select(getNotebooks);

    this.subscriptions.push(
      this.route.paramMap.subscribe(this.onLoad.bind(this)),
      this.phrase$.pipe(filter(phrase => phrase != null && phrase != undefined)).subscribe(this.onSelectPhrase.bind(this)),
      this.notebooks$.subscribe(this.onSelectNotebooks.bind(this))
    );
  }

  onLoad(params: ParamMap) {
    this.store.dispatch(new LoadPhrase(+params.get('id')));
  }

  onSelectPhrase(phrase: Phrase) {
    this.rebuildForm(phrase);
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
    this.store.dispatch(new UpdatePhrase({phrase: this.prepareSave()}));
  }

  private createForm() {
    this.phraseForm = this.fb.group({
      id: [0, Validators.required],
      title: ['', Validators.required],
      meter: ['', Validators.required],
      length: ['', Validators.required],
      reference: '',
      key: ['', Validators.required],
      abc: ['', Validators.required],
      notebook: [0, Validators.required],
    });
  }

  private rebuildForm(phrase: Phrase) {
    this.phraseForm.reset({
      id: phrase.id,
      title: phrase.title,
      meter: phrase.meter,
      length: phrase.length,
      reference: phrase.reference,
      key: phrase.key,
      abc: phrase.abc,
      notebook: phrase.notebook.id,
    });
  }

  private prepareSave(): Phrase {
    const formModel = this.phraseForm.value;
    return Object.assign(new Phrase(), {
      id: formModel.id,
      title: formModel.title as string,
      meter: formModel.meter as string,
      length: formModel.length as string,
      reference: formModel.reference as string,
      key: formModel.key as string,
      abc: formModel.abc as string,
      notebook: this.notebooks.find(notebook => notebook.id == formModel.notebook),
    });
  }

  private updatePaper() {
    const phrase = this.prepareSave();
    this.abcArea.nativeElement.value = phrase.toString();
    this.abcArea.nativeElement.dispatchEvent(new Event('change'));
  }
}

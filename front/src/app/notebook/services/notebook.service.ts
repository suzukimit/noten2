import {AbstractService} from '../../common/abstract.service';
import {Notebook} from '../models/notebook';
import { Injectable } from "@angular/core";

@Injectable()
export class NotebookService extends AbstractService<Notebook> {
  entityName = 'notebooks';
}

import {AbstractService} from '../../common/abstract.service';
import {Notebook} from '../models/notebook';

export class NotebookService extends AbstractService<Notebook> {
  entityName = 'notebooks';
}

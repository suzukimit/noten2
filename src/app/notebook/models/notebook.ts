import {AbstractModel} from '../../common/abstract.model';
import {Phrase} from '../../phrase/models/phrase';

export class Notebook extends AbstractModel {
  name = '';
  phrases: Phrase[];
}


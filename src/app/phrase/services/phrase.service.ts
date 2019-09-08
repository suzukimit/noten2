import {AbstractService} from '../../common/abstract.service';
import {Phrase} from '../models/phrase';

export class PhraseService extends AbstractService<Phrase> {
  entityName = 'phrases';
}

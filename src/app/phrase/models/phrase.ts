import {AbstractModel} from '../../common/abstract.model';

export class Phrase extends AbstractModel {
  title = '';
  meter = '';
  length = '';
  reference = '';
  key = '';
  abc = '';

  toString(): string {
    return `
X: 1
T: ${this.title}
M: ${this.meter}
L: ${this.length}
R: ${this.reference}
K: ${this.key}
${this.abc}
    `
  }

  static createDefault() {
    const phrase = new Phrase();
    phrase.title = 'new';
    phrase.meter = meters[0];
    phrase.length = lengths[0];
    phrase.key = keys[0];
    phrase.abc = 'cdefgab';
    return phrase;
  }
}

export const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const lengths = ['1/2', '1/4', '1/8', '1/16'];
export const meters = ['1/2', '2/2', '3/4', '4/4', '5/4', '5/8', '6/8', '7/8', '8/8', '9/8', '9/8'];

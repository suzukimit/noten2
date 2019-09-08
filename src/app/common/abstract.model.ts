export class EmbeddedResource {
  _embedded: any[];
  _links: Links;
}

export class AbstractModel {
  id: number;
  createdAt: any;
  updatedAt: any;
  _links: Links;
}

export class Links {
  self: HRef;
}

export class HRef {
  href: string;
}

export class Photo {
  id: number | undefined;
  title: string | undefined;
  url: string | undefined;
  thumbnailUrl: string | undefined;
  albumId: number | undefined;

  get isNew (): boolean {
    return this.id === undefined;
  }

  constructor (initializer: Partial<Photo> = {}) {
    Object.assign(this, initializer);
  }
}
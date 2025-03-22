export class Project {
  id: number | undefined;
  name: string | undefined;
  description: string | undefined;
  imageUrl: string | undefined;
  contractTypeId: number | undefined;
  contractSignedOn: Date = new Date();
  budget: number = 0;
  isActive: boolean = false;
  get isNew (): boolean {
    return this.id === undefined;
  }

  constructor (initializer: Partial<Project> = {}) {
    Object.assign(this, initializer);
  }
}
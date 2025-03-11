export class WrongTaskStatusException extends Error {
  constructor() {
    super('Wrong Task Status Transition');
    this.name = 'WrongTaskStatusException';
  }
}

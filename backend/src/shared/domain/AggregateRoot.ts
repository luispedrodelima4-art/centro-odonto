import { Entity } from './Entity.js';
import { IDomainEvent } from './IDomainEvent.js';
import { UniqueEntityId } from './Identifier.js';

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: IDomainEvent[] = [];

  get id(): UniqueEntityId {
    return this._id;
  }

  get domainEvents(): IDomainEvent[] {
    return [...this._domainEvents];
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}

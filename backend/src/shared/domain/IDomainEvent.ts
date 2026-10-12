import { UniqueEntityId } from './Identifier.js';

export interface IDomainEvent {
  dateTimeOccurred: Date;
  getAggregateId(): UniqueEntityId;
}

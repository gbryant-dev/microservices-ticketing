import { ExpirationCompleteEvent, Publisher, Subjects } from "@gbtickets/common"


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;

}
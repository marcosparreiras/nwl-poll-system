interface Message {
  pollOptionId: string;
  votes: number;
}

type Subscriber = (message: Message) => void;

export class VoteEvents {
  private channels: Record<string, Subscriber[]> = {};

  public subscribe(pollId: string, Subscriber: Subscriber) {
    if (!this.channels[pollId]) {
      this.channels[pollId] = [];
    }
    this.channels[pollId].push(Subscriber);
  }

  public publish(pollId: string, message: Message) {
    if (!this.channels.pollId) {
      return;
    }
    this.channels[pollId].forEach((sub) => {
      sub(message);
    });
  }
}

export const voteEvents = new VoteEvents();

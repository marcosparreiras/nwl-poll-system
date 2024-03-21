type Message = { pollOptionId: string; votes: number };
type Subscriber = (message: Message) => void;

class VotingPubSub {
  private channels: Record<string, Subscriber[]> = {};

  public subscribe(pollId: string, subscriber: Subscriber): void {
    if (!this.channels[pollId]) {
      this.channels[pollId] = [];
    }
    this.channels[pollId].push(subscriber);
  }

  public publish(pollId: string, message: Message): void {
    if (!this.channels[pollId]) {
      return;
    }
    this.channels[pollId].forEach((sub) => {
      sub(message);
    });
  }
}

export const voting = new VotingPubSub();

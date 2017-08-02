// @flow
import ActionCable from 'actioncable';

const JSON_FIELDS = ['status', 'message', 'progress', 'result'];

export default class WebSocketConnection {

  constructor(oauthToken: string, serverAddr: string) {
    this.oauthToken = oauthToken;
    this.serverAddr = serverAddr;
  }

  cable: ActionCable.Cable;
  connection: ActionCable.Channel;
  oauthToken: string;
  serverAddr: string;

  deleteSubscription(): void {
    this.connection.unsubscribe();
  }

  createSubscription(
    onUpdate: (result: Object) => void,
    onDisconnected: () => void,
    onInvalidDataError: () => void,
    sentExerciseId: number,
    ): void {
    this.cable = ActionCable.createConsumer(this._addExtraParamsToUrl(this.serverAddr, sentExerciseId));
    this._subscribe(onUpdate, onDisconnected, onInvalidDataError, sentExerciseId);
  }

  _subscribe(
    onUpdate: (result: Object) => void,
    onDisconnected: () => void,
    onInvalidDataError: () => void,
    exerciseId: number,
    ): void {
    const connection = this.cable.subscriptions.create('SubmissionStatusChannel', {
      connected() {
        // ask for current state from server in case socket open too late
        connection.send({ ping: true, id: exerciseId });
      },
      disconnected() {
        onDisconnected();
      },
      received(data) {
        console.info(data);
        let result = {};
        try {
          result = JSON.parse(data);
          if (!WebSocketConnection._correctJSON(result)) {
            throw SyntaxError('Malformed data');
          }
        } catch (error) {
          console.error(`error: ${error}`);
          onInvalidDataError();
        }
        onUpdate(result);
      },
    });
    this.connection = connection;
  }

  static _correctJSON(JSON: Object): boolean {
    let valid = true;
    JSON_FIELDS.forEach((field) => {
      if (!Object.prototype.hasOwnProperty.call(JSON, field)) {
        valid = false;
      }
    });
    return valid;
  }

  _addExtraParamsToUrl(url: string, exerciseId: number): string {
    return `${url}?oauth_token=${this.oauthToken}&exercise_id=${exerciseId}`;
  }
}

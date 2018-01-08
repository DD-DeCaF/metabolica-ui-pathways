export class PathwaysWSProvider {
  private host = 'wss://api-staging.dd-decaf.eu/pathways';
  private prefix = '/ws';

  public $get() {
    return `${this.host}${this.prefix}`;
  }
}

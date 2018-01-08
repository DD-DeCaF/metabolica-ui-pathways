export class PathwaysAPIProvider {
  private host = 'https://api-staging.dd-decaf.eu/pathways';

  public $get() {
    return this.host;
  }
}

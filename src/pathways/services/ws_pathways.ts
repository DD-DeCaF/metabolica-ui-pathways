import * as _ from 'lodash';

import 'angular-toastr';

interface RequestDetails {
    path: string;
    params: Object;
}

interface Callback {
    id: string;
    deffered: angular.IDeferred<any>;
    data: string;
}


// WS url
export const WS_PATHWAYS_ROOT_URL = 'wss://api.dd-decaf.eu/pathways/ws';

export class WSServicePathways {

    public reconnectInterval: number = 1000;
    public timeoutInterval: number = 10000;
    public readyState: number;
    public message: any;

    private _forcedClose: boolean = false;
    private _timedOut: boolean = false;
    private _ws: WebSocket;
    private _url: string;
    private _callbacks: Callback[] = [];
    private _q: angular.IQService;
    private _toastr: angular.toastr.IToastrService;
    private _scope: angular.IScope;

    public onopen: (ev: Event) => void = function (event: Event) {};
    public onclose: (ev: CloseEvent) => void = function (event: CloseEvent) {};
    public onconnecting: () => void = function () {};
    public onmessage: (ev: MessageEvent) => void = function (event: MessageEvent) {};
    public onerror: (ev: ErrorEvent) => void = function (event: ErrorEvent) {};

    constructor($q: angular.IQService, toastr: angular.toastr.IToastrService, $rootScope: angular.IScope) {
        this._q = $q;
        this._toastr = toastr;
        this._scope = $rootScope;
    }

    public connect(reconnectAttempt: boolean) {
        this.readyState = WebSocket.CONNECTING;
        this.message = {};
        this._ws = new WebSocket(WS_PATHWAYS_ROOT_URL);
        this.onconnecting();

        let localWs = this._ws;

        let timeout = setTimeout(() => {
            this._timedOut = true;
            localWs.close();
            this._timedOut = false;
        }, this.timeoutInterval);

        this._ws.onopen = (event: Event) => {
            clearTimeout(timeout);
            this.readyState = WebSocket.OPEN;
            reconnectAttempt = false;

            this.onopen(event);
        };

        this._ws.onclose = (event: CloseEvent) => {
            clearTimeout(timeout);
            this._ws = null;
            if (this._forcedClose) {
                this.readyState = WebSocket.CLOSED;
                this.onclose(event);
            } else {
                this.readyState = WebSocket.CONNECTING;
                this.onconnecting();
                if (!reconnectAttempt && !this._timedOut) {
                    this.onclose(event);
                }
                setTimeout(() => {
                    this.connect(true);
                }, this.reconnectInterval);
            }
        };

        this._ws.onmessage = (event) => {
            this.message = JSON.parse(event.data);
            this._scope.$root.$broadcast('messageArrived', this.message);
        };

        this._ws.onerror = (event: ErrorEvent) => {

            this._toastr.error('Oops! WebSocket error. Try again', '', {
                closeButton: true,
                timeOut: 2500
            });

            this._callbacks = [];
            this.onerror(event);
        };
    }

    public send(data: any) {
        this._ws.send(data);
    }

    /**
     * Returns boolean, whether websocket was FORCEFULLY closed.
     */
    public close(): boolean {
        if (this._ws) {
            this._forcedClose = true;
            this._ws.close();
            return true;
        }
        return false;
    }

    /**
     * Additional public API method to refresh the connection if still open
     * (close, re-open). For example, if the app suspects bad data / missed
     * heart beats, it can try to refresh.
     *
     * Returns boolean, whether websocket was closed.
     */
    public refresh(): boolean {
        if (this._ws) {
            this._ws.close();
            return true;
        }
        return false;
    }

}

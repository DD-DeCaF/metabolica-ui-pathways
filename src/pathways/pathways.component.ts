import * as angular from 'angular';
import * as d3 from 'd3';

import { EscherService } from './escher.service';
import { PathwaysService } from './pathways.service';
import * as template from './pathways.component.html';
import { WSServicePathways } from './services/ws_pathways';
import './pathways.component.scss';
import './escher_builder.scss';

export interface FormConfig {
    title: string;
    attr: string;
    placeholder: string;
    list: () => any[];
}

export class PathwaysController {
    isDisabled: boolean;
    isWaiting: boolean;
    models: any[];
    universalModels: any[];
    carbonSources: any[];
    products: any;
    formConfig: FormConfig[];
    searchTexts: any;
    message: string;
    product: any;
    model: any;
    universalModel: any;
    carbonSource: any;
    data: any;
    aggr: any;
    param: any;
    currentPathway: any;
    currentKey: String;
    userKey: String;
    progress: Number;
    pathwaysService: PathwaysService;
    escherService: EscherService;
    private _ws: WSServicePathways;
    private _scope: angular.IScope;
    private _timeout: angular.ITimeoutService;
    private _mdSidenav: angular.material.ISidenavService;
    private _interval: angular.IIntervalService;
    private _timer: angular.IPromise<any>;
    private _$sharing: any;
    private builder: any;
    // @matyasfodor figure out the proper typing
    private escherElement: HTMLElement;

    constructor($mdSidenav: angular.material.ISidenavService,
                $rootScope: angular.IScope,
                $scope: angular.IScope,
                $timeout,
                PathwaysService: PathwaysService,
                EscherService: EscherService,
                wsPathways: WSServicePathways,
                $interval: angular.IIntervalService,
                $element: angular.IAugmentedJQuery,
                $sharing
    ) {
        this._mdSidenav = $mdSidenav;
        this._timeout = $timeout;
        this._interval = $interval;
        this._ws = wsPathways;
        this._ws.connect(true);
        this._scope = $scope;
        this._$sharing = $sharing;
        this.isDisabled = false;
        this.isWaiting = false;
        this.models = [];
        this.universalModels = [];
        this.products = {};
        this.carbonSources = [];
        this.pathwaysService = PathwaysService;
        this.escherService = EscherService;
        this.escherElement = $element.find('escher')[0];
        this.loadLists();
        this.formConfig = [
            {
                title: 'Universal model',
                attr: 'universalModels',
                placeholder: 'metanetx_universal_model_bigg',
                list: () => this.universalModels
            },
            {
                title: 'Model',
                attr: 'models',
                placeholder: 'iJO1366',
                list: () => this.models.concat([{
                    value: this.searchTexts.universalModels,
                    display: this.searchTexts.universalModels
                }])
            },
            {
                title: 'Product',
                attr: 'products',
                placeholder: '',
                list: () => this.products[this.searchTexts.universalModels]
            }
        ];

        this.searchTexts = {};
        this.defaultSearchValues();
        this.message = '';
        this.product = undefined;
        this.data = {};
        this.aggr = {};
        this.progress = 0;

        $scope.$on('messageArrived', (event, message) => {
            $rootScope.$apply((scope) => {
                if (!message) return;
                const {pathways, is_ready} = message;
                this.progress = pathways.length * 10;
                this.data = this.mergeSimilarPathways(pathways);
                const lastPathwayKey = this.lastValidPathwayKey(pathways, this.pathwayID);
                if (lastPathwayKey != this.currentKey && !this.userKey) {
                    this.setCurrent(lastPathwayKey);
                }
                this.isWaiting = !is_ready;
                if (!this.isWaiting) {
                    this.stopPolling();
                    this.progress = 0;
                    if (pathways.length == 0) {
                        this.message = 'No pathways found'
                    }
                }
            });
        });

        $scope.$on('$destroy', function handler() {
            wsPathways.close();
        });
    }

    startPolling() {
        this._timer = this._interval(() => {
            this._ws.send(JSON.stringify(this.param));
        }, 1000);
    }

    stopPolling() {
        if (angular.isDefined(this._timer)) {
            this._interval.cancel(this._timer);
            this._timer = undefined;
        }
    }

    refreshPolling() {
        this.stopPolling();
        this.startPolling();
    }

    defaultSearchValues() {
        this.formConfig.forEach((value) => {
            this.searchTexts[value.attr] = value.placeholder;
        });
    }
    querySearch (query, data) {
        return query ? data.filter( this.createFilterFor(query) ) : data;
    }
    createFilterFor(query) {
        const lowercaseQuery = angular.lowercase(query);
        return ({display}) => angular.lowercase(display).includes(lowercaseQuery)
    }
    loadLists() {
        this.loadAllUniversalModels();
        this.loadAllModels();
        this.loadAllCarbonSources();
    }
    loadAllModels() {
        this.pathwaysService.loadModels()
            .then((data: any) => {
                data.data.forEach((value) => {
                    this.models.push({
                        value: value.id,
                        display: `${value.name} (${value.id})`
                    });
                });
            });
    }

    loadAllUniversalModels() {
        this.pathwaysService.loadUniversalModels()
            .then((data: any) => {
                data.data.forEach((value) => {
                    this.universalModels.push({
                        value: value.id,
                        display: value.name
                    });
                });
                this.loadAllProducts();
            });
    }

    loadAllProducts() {
        angular.forEach(this.universalModels, (value) => {
            const universalModelId = value.value;
            this.products[universalModelId] = [];
            this.pathwaysService.loadProducts(universalModelId)
                .then((data: any) => {
                        data.data.forEach((productValue) => {
                            this.products[universalModelId].push({
                                value: productValue.id,
                                display: productValue.name
                            });
                        });
                    }
                );
        }, this.products);
    }

    loadAllCarbonSources() {
        this.pathwaysService.loadCarbonSources()
            .then((data: any) => data.data.forEach((value) => {
                this.carbonSources.push({
                    value: value.id,
                    display: value.name
                });
            }));
    }

    setUserKey(key) {
        this.userKey = key;
        this.setCurrent(key);
    }

    setCurrent(key) {
        this.currentKey = key;
        this.currentPathway = this.data[key][0];
        const {builder, pathway} = this.escherService.buildMap(
            this.currentPathway.model,
            this.product,
            d3.select(this.escherElement));
        this.builder = builder;
        this._$sharing.provide({
            pathwayPrediction: {
                param: this.param,
                model: this.currentPathway.model,
                pathway,
            }
        });
    }

    public toggleRight(): void{
        this._mdSidenav('right').toggle();
    }

    pathwayID(pathway): String {
        if (pathway.reactions.length != pathway.model.reactions.length) {
            return undefined;
        }
        return pathway.primary_nodes.map((x) => x.name).join(' - ');
    }

    lastValidPathwayKey(pathways, predicate: (pathway: any) => String,lastInd?: number): String {
        return pathways
            .map(predicate)
            .reverse()
            .find(x => x !== undefined);
    }

    mergeSimilarPathways(data) {
        let result = {};
        let key;
        for (let i in data) {
            if (data[i].reactions.length != data[i].model.reactions.length) {
                continue;
            }
            key = this.pathwayID(data[i]);
            if (!result.hasOwnProperty(key)) {
                result[key] = [];
            }
            result[key].push(data[i]);
            let curReactions = data[i].reactions;
            if (!this.aggr.hasOwnProperty(key)) {
                this.aggr[key] = [];
                angular.forEach(curReactions, function(_){this.push({})}, this.aggr[key])
            }
            for (let j in curReactions) {
                this.aggr[key][j][curReactions[j].id] = curReactions[j];
            }
        }
        return result;
    }

    submit() {
        this.currentPathway = undefined;
        this.currentKey = undefined;
        this.userKey = undefined;
        angular.element(this.escherElement).empty();
        this.data = {};
        this.aggr = {};
        this.message = '';
        this.progress = 0;
        this.model = this.searchTexts.models;
        this.product = this.searchTexts.products;
        this.universalModel = this.searchTexts.universalModels;
        this.carbonSource = this.searchTexts.carbonSources;
        this.isWaiting = true;

        this.param = {
            product_id: this.product,
            carbon_source_id: 'EX_glc_lp_e_rp_',
            universal_model_id: this.universalModel,
            model_id: this.model,
        };
        // Here we start the websocket connection
        this.refreshPolling();
        // And this is a pure HTTP request
        this.pathwaysService
            // Duplicate of this.param        
            .getStatus(this.universalModel, this.model, 'EX_glc_lp_e_rp_', this.product)
            // Here we only handle the error.
            .then(
                // Success
                (statusResponse) => {},
                // Error
                (statusResponse) => {
                    let status = statusResponse.status;
                    this.isWaiting = false;
                    this.stopPolling();
                    if (status === 404) {
                        this.message = 'No such key';
                    }
                }
            );
    };

}

export const PathwaysComponent: angular.IComponentOptions = {
    controller: PathwaysController,
    controllerAs: 'ctrl',
    template: template.toString()
};

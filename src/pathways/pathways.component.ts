import * as angular from 'angular';
import {EscherService} from './escher.service';
import {PathwaysService} from './pathways.service';
import * as template from './pathways.component.html';
import {WSService} from './services/ws';

import './escher_builder.scss';

interface FormConfig {
    title: string;
    attr: string;
    placeholder: string;
    list: () => any[];
}

class PathwaysController {
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
    prevData: any;
    mapIdPrefix: string;
    pathwaysService: PathwaysService;
    escherService: EscherService;
    private _ws: WSService;
    private _scope: angular.IScope;
    private $timeout: angular.ITimeoutService;

    constructor($rootScope: angular.IScope, $scope: angular.IScope, $timeout, PathwaysService: PathwaysService, EscherService: EscherService, ws: WSService) {
        this.$timeout = $timeout;
        this._ws = ws;
        this._scope = $scope;
        this.isDisabled = false;
        this.isWaiting = false;
        this.models = [];
        this.universalModels = [];
        this.products = {};
        this.carbonSources = [];
        this.pathwaysService = PathwaysService;
        this.escherService = EscherService;
        this.loadLists();
        this.formConfig = [
            {
                'title': 'Universal model',
                'attr': 'universalModels',
                'placeholder': 'metanetx_universal_model_bigg',
                'list': () => this.universalModels
            },
            {
                'title': 'Model',
                'attr': 'models',
                'placeholder': 'iJO1366',
                'list': () => {
                    return this.models.concat([{
                        value: this.searchTexts.universalModels,
                        display: this.searchTexts.universalModels
                    }]);
                }
            },
            // {
            //     'title': 'Carbon source',
            //     'attr': 'carbonSources',
            //     'placeholder': 'EX_glc_lp_e_rp_',
            //     'list': () => this.carbonSources
            // },
            {
                'title': 'Product',
                'attr': 'products',
                'placeholder': '',
                'list': () => this.products[this.searchTexts.universalModels]
            }
        ];

        this.searchTexts = {};
        this.defaultSearchValues();
        this.message = '';
        this.product = undefined;
        this.data = [];
        this.prevData = [];
        this.mapIdPrefix = 'mapContainer';

        $scope.$on('messageArrived', (event, message) => {
            $rootScope.$apply((scope) => {
                if (message) {
                    this.data = this.mergeSimilarPathways(message.pathways);
                    this.isWaiting = !message.is_ready;
                    if (!this.isWaiting) {
                        ws.close();
                        if (message.pathways.length == 0) {
                            this.message = 'No pathways found'
                        }
                    }
                }
            });
        });

        $scope.$on('$destroy', function handler() {
            ws.close();
        });
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
        let lowercaseQuery = angular.lowercase(query);
        return function filterFn(option) {
            return (angular.lowercase(option.display).indexOf(lowercaseQuery) !== -1);
        };
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
                        display: value.name + ' (' + value.id + ')'
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
            let universalModelId = value.value;
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

    mergeSimilarPathways(data) {
        let result = {'broke': []};
        let name;
        for (let i in data) {
            if (data[i].reactions.length != data[i].model.reactions.length) {
                name = 'broke';
            } else {
                name = data[i].primary_nodes.map((x) => x.name).join(' - ');
            }
            if (!result.hasOwnProperty(name)) {
                result[name] = [];
            }
            result[name].push(data[i]);
        }
        return result;
    }

    submit() {
        this._ws.close();
        this.data = [];
        this.message = '';
        this.model = this.searchTexts.models;
        this.product = this.searchTexts.products;
        this.universalModel = this.searchTexts.universalModels;
        this.carbonSource = this.searchTexts.carbonSources;
        this.isWaiting = true;

        let param = {
            'product': this.product,
            'carbonSource': 'EX_glc_lp_e_rp_',
            'universalModel': this.universalModel,
            'model': this.model,
        };

        this._ws.connect(true, param);

        // Open WS connection if it is not opened
        this.pathwaysService
            .getStatus(this.universalModel, this.model, 'EX_glc_lp_e_rp_', this.product)
            .then(
                // Success
                (statusResponse) => {
                    let status = statusResponse.status;
                    if (status !== 202) {
                        this.isWaiting = false;
                    }
                },
                // Error
                (statusResponse) => {
                    let status = statusResponse.status;
                    this.isWaiting = false;
                    if (status === 404) {
                        this.message = 'No such key';
                    }
                }
            );
    };

}

export const PathwaysComponent: angular.IComponentOptions = {
    controller: PathwaysController,
    controllerAs: 'pathwaysController',
    template: template.toString()
};

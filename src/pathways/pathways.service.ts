// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { PathwaysAPIProvider } from './providers/pathwaysapi.provider';


export class PathwaysService {
    private $http: angular.IHttpService;
    private api: PathwaysAPIProvider;

    constructor($http: angular.IHttpService, pathwaysAPI: PathwaysAPIProvider) {
        this.$http = $http;
        this.api = pathwaysAPI;
    }
    getPathways(universalModelId, modelId, carbonSourceId, productId) {
        return this.$http({
            method: 'GET',
            url: `${this.api}/pathways`,
            params: {
                'product_id': productId,
                'model_id': modelId,
                'universal_model_id': universalModelId,
                'carbon_source_id': carbonSourceId
            }
        });
    }
    getStatus(universalModelId, modelId, carbonSourceId, productId) {
        return this.$http({
            method: 'GET',
            url: `${this.api}/predict`,
            params: {
                'product_id': productId,
                'model_id': modelId,
                'universal_model_id': universalModelId,
                'carbon_source_id': carbonSourceId
            }
        });
    }
    loadProducts(universalModelId) {
        return this.$http({
            method: 'GET',
            url: `${this.api}/lists/product`,
            params: {'universal_model_id': universalModelId}
        });
    }
    loadModels() {
        return this.$http({
            method: 'GET',
            url: `${this.api}/lists/model`
        });
    }
    loadUniversalModels() {
        return this.$http({
            method: 'GET',
            url: `${this.api}/lists/universal_model`
        });
    }
    loadCarbonSources() {
        return this.$http({
            method: 'GET',
            url: `${this.api}/lists/carbon_source`
        });
    }
}

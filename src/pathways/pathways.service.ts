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

import {API_ROOT_URL} from './constants';


export class PathwaysService {
	private $http: angular.IHttpService;

	constructor($http) {
		this.$http = $http;
	}
	getPathways(universalModelId, modelId, carbonSourceId, productId) {
		return this.$http({
			method: 'GET',
			url: `${API_ROOT_URL}/pathways`,
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
			url: `${API_ROOT_URL}/predict`,
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
			url: `${API_ROOT_URL}/lists/product`,
			params: {'universal_model_id': universalModelId}
		});
	}
	loadModels() {
		return this.$http({
			method: 'GET',
			url: `${API_ROOT_URL}/lists/model`
		});
	}
	loadUniversalModels() {
		return this.$http({
			method: 'GET',
			url: `${API_ROOT_URL}/lists/universal_model`
		});
	}
	loadCarbonSources() {
		return this.$http({
			method: 'GET',
			url: `${API_ROOT_URL}/lists/carbon_source`
		});
	}
}

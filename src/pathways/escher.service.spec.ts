import * as angular from 'angular';
import { EscherService } from './escher.service';


describe('EscherService.alignReactions', () => {
    let escherService: EscherService;

    beforeEach(angular.mock.module('PathwaysApp'));
    
    beforeEach(angular.mock.inject(($injector) => {
        escherService = $injector.get('EscherService');
    }));

});

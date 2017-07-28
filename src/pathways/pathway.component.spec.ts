import * as angular from 'angular';
import { PathwaysController } from './pathways.component';

describe('PathwaysController', () => {
  let pathwaysController: PathwaysController;

  beforeEach(angular.mock.module('pathways'));
  
  beforeEach(angular.mock.inject(($injector) => {
    const $rootScope = $injector.get('$rootScope');
    pathwaysController = new PathwaysController(
      $injector.get('$mdSidenav'),
      $rootScope,
      $rootScope.$new(),
      $injector.get('$timeout'),
      $injector.get('PathwaysService'),
      $injector.get('EscherService'),
      $injector.get('wsPathways'),
      $injector.get('$interval')
    );
  }));

  it('should be not null', () => {
    expect(pathwaysController).not.toBeNull();
  });

  describe('lastValidPathwayKey', () => {    
    it('should return the last index if it\'s not undefined', () => {
      const array = [undefined, undefined, undefined, '3'];
      expect(pathwaysController.lastValidPathwayKey(array, x => x))
        .toBe('3');
    });

    it('should return the last defined parameter', () => {
      const array = [undefined, '1', undefined, undefined];
      expect(pathwaysController.lastValidPathwayKey(array, x => x))
        .toBe('1');
    });

    it('should return undefined if predicate retruns undefined for every element', () => {
      const array = [1, 2, 3, 4, 'a', 'b'];
      expect(pathwaysController.lastValidPathwayKey(array, () => undefined))
        .toBeUndefined();
    });
  });
});

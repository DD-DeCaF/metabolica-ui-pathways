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
      $injector.get('$interval'),
      $injector.get('$element'),
      $injector.get('$http'),
      $injector.get('decafAPI'),
      $injector.get('$sharing'),
      $injector.get('$mdComponentRegistry')
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

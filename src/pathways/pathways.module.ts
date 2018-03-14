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
import * as toastr from 'angular-toastr';

import { WSServicePathways } from './services/ws_pathways';
import { DecafAPIProvider } from './providers/decafapi.provider';
import { PathwaysAPIProvider } from './providers/pathwaysapi.provider';
import { PathwaysWSProvider } from './providers/pathwaysws.provider';
import { PathwaysService } from './pathways.service';
import { EscherService } from './escher.service';
import { PathwaysComponent } from './pathways.component';
import EDIT from '../../img/icons/edit.svg';
import {AppModule} from 'metabolica';

export const PathwaysModule = angular.module('pathways', [
        toastr,
        'ngMaterial',
        'ui.router',
        AppModule.name,
    ])
    .provider('decafAPI', DecafAPIProvider)
    .provider('pathwaysAPI', PathwaysAPIProvider)
    .provider('pathwaysWS', PathwaysWSProvider)
    .service('PathwaysService', PathwaysService)
    .service('EscherService', EscherService)
    .service('wsPathways', WSServicePathways)
    .component('ppPathways', PathwaysComponent)
    .config(($mdIconProvider, $stateProvider, appNavigationProvider) => {
        $mdIconProvider.icon('edit', EDIT, 24);

        appNavigationProvider.register('app.pathways', {
            title: 'Design',
            icon: 'edit',
            authRequired: false,
			tooltip: 'Search for new pathways to a compound of interest in your favorite model organism'
        });

        $stateProvider
            .state({
                name: 'app.pathways',
                url: '/pathways',
                component: 'ppPathways',
                data: {
                    title: 'Pathways' // FIXME look up from app nagivation provider
                }
            })
    });

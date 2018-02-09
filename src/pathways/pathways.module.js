import angular from 'angular';
import toastr from 'angular-toastr';
import { WSServicePathways } from './services/ws_pathways';
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
            authRequired: false
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

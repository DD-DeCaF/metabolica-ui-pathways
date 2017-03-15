import angular from 'angular';
import {PathwaysService} from './pathways.service';
import {EscherService} from './escher.service';
import {PathwaysComponent} from './pathways.component';
import TIMELINE from '../../img/icons/timeline.svg';


export const PathwaysModule = angular.module('pathways', [])
	.service('PathwaysService', PathwaysService)
	.service('EscherService', EscherService)
	.component('pathways', PathwaysComponent)
	.config(function ($mdIconProvider, $stateProvider, appNavigationProvider) {
		$mdIconProvider.icon('timeline', TIMELINE, 24);

        appNavigationProvider.register('app.pathways', {
            title: 'Pathways',
            icon: 'timeline'
        });

        $stateProvider
            .state({
                name: 'app.pathways',
                url: '/pathways',
                component: 'pathways',
                data: {
                    title: 'Pathways' // FIXME look up from app nagivation provider
                }
            })
    });
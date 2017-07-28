import * as angular from 'angular';
import { EscherService } from './escher.service';


describe('EscherService.alignReactions', () => {
    let escherService: EscherService;

    beforeEach(angular.mock.module('pathways'));
    
    beforeEach(angular.mock.inject(($injector) => {
        escherService = $injector.get('EscherService');
    }));

    it('should sort reactions and flip them if required', () => {
        const model = {
            reactions: [
                {
                    id: "MNXR5338",
                    metabolites: {
                        "MNXM8": 1,
                        "MNXM1": -2,
                        "MNXM204": -1,
                        "MNXM2": 1,
                        "MNXM10": -1,
                        "MNXM2779": 1
                    },
                },
                {
                    id: "MNXR68718",
                    metabolites: {
                        "MNXM204": -1,
                        "MNXM611": 1,
                        "MNXM2": -1
                    },
                },
                {
                    id: "MNXR1039",
                    metabolites: {
                        "MNXM443": 1,
                        "MNXM2779": -1,
                        "MNXM2": 1,
                        "MNXM21": -1
                    }
                }
            ]
        };
        const reactions = [
            "MNXR1039",
            "MNXR5338",
            "MNXR68718",
        ];
        const primaryNodes = [
            "MNXM2779", // No Change; 3rd
            "MNXM2", // Change; 1st
            "MNXM204", // No Change; 2nd
        ];
        expect(escherService.alignReactions(model, reactions, primaryNodes)).toEqual({
                reactions: [
                    {
                        id: "MNXR1039",
                        metabolites: {
                            "MNXM443": 1,
                            "MNXM2779": -1,
                            "MNXM2": 1,
                            "MNXM21": -1
                        }
                    },
                    {
                        id: "MNXR5338",
                        metabolites: {
                            "MNXM8": -1,
                            "MNXM1": 2, 
                            "MNXM204": 1,
                            "MNXM2": -1,
                            "MNXM10": 1,
                            "MNXM2779": -1
                        },
                    },
                    {
                        id: "MNXR68718",
                        metabolites: {
                            "MNXM204": -1,
                            "MNXM611": 1,
                            "MNXM2": -1
                        },
                    },
                ]
            });
    });
});

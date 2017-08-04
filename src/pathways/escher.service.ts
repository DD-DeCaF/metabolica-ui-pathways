import * as escher from '@dd-decaf/escher'
import * as d3 from 'd3';

import 'jquery';

export class EscherService {
    private direction: number;
    private options: any;
    private metaboliteIds: any[];
    private reactions: any[];
    private builder: any;

    constructor() {
        // TODO make it const
        this.direction = -90;
        this.metaboliteIds = [];
        this.reactions = [];
        this.options = {
            // just show the zoom buttons
            menu: 'zoom',
            // do not use the smooth pan and zoom option
            use_3d_transform: false,
            // no editing in this map
            enable_editing: true,
            // show the descriptive names
            identifiers_on_map: 'name',
            // hide secondary metabolites
            hide_secondary_metabolites: true,
            // don't ask before quiting
            never_ask_before_quit: true,
            // disable keyboard shortcuts
            enable_keys: false,
        }
    };

    addReactions(builder) {
        const startCoordinates = { x: 100, y: (this.reactions.length / 2) * 400 + 500 };

        const reactionsWithNodes = this.reactions.map(
            (r, index) => [r, this.metaboliteIds[index]]
        );
        const [[firstReaction], ...restReactionWithNodes] = reactionsWithNodes.slice().reverse();
        builder.map.new_reaction_from_scratch(
            firstReaction,
            startCoordinates,
            this.direction
        );
        restReactionWithNodes.forEach(([reaction, nodeName]) => {
            // Note: Nodes behaves like an array, but it's a dicitionary
            // with sequential integer indices
            const [nodeIndex] = Object.entries(builder.map.nodes).find(([k, v]) => v.bigg_id === nodeName);
            if (nodeIndex !== undefined) {
                builder.map.new_reaction_for_metabolite(
                    reaction,
                    nodeIndex,
                    this.direction
                );
            }
        });

        // Set metabolites node to primary if it's not among the metabolites.
        const metaboliteIdSet = new Set(this.metaboliteIds)
        builder.map.nodes = Object.assign({}, ...Object.entries(builder.map.nodes)
            .map(([index, node]) => {
                return {
                    [index]: {
                        ...node,
                        node_is_primary: metaboliteIdSet.has(node.bigg_id)
                    }
                }
            }))


        builder.map.draw_everything();
        builder.map.zoom_extent_canvas();
        builder.map.select_none();
    }

    /**
     * Flips the reaction in the other direction by changing
     * the sign of metabolites' the stoichiometric number
     */
    reverseReaction(reaction) {
        return Object.assign({}, reaction, {
            metabolites: Object.assign({},
                ...Object.entries(reaction.metabolites).map(([k, v]) => { return { [k]: -v } })
            )
        });
    }

    // TODO this violates the SRP -> should be two separate functions.
    /**
     * Sorts the model's reaction and flips them if required
     */
    alignReactions(model, reactionIds, primaryNodes) {
        // The keyBy + at function could be combined into a utility function
        const reactionsById = Object.assign({}, ...model.reactions.map(r => ({ [r.id]: r })));
        const reactionWithPrimaryNode = reactionIds.map(
            (reactionId, index) => [reactionsById[reactionId], primaryNodes[index]]
        );
        const alignedReactions = reactionWithPrimaryNode.map(([reaction, primaryNode]) => {
            return reaction.metabolites[primaryNode] > 0 ? this.reverseReaction(reaction) : reaction;
        });
        return { ...model, reactions: alignedReactions };
    }

    buildMap(model, productName, controller_id) {
        const product = model.metabolites.find(m => m.name === productName);
        const { reactions, primaryNodes } = escher.PathwayGraph.sortedReactionsProducts(model.reactions, product.id)
        if (this.reactions == reactions) {
            return;
        }
        this.reactions = reactions;

        this.metaboliteIds = primaryNodes;
        this.builder = escher.Builder(
            null,
            this.alignReactions(model, reactions, primaryNodes),
            null,
            d3.select('#' + controller_id),
            this.options
        );
        this.addReactions(this.builder);
    }
}

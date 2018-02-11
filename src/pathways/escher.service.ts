import * as escher from '@dd-decaf/escher'

export class EscherService {
    readonly direction = -90;
    readonly options = {
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
    };

    addReactions(builder, pathway) {
        const startCoordinates = { x: 100, y: (pathway.length / 2) * 350 };

        const [firstSegment, ...restPathwaySegment] = pathway;
        builder.map.new_reaction_from_scratch(
            firstSegment.reaction,
            startCoordinates,
            this.direction
        );
        restPathwaySegment.forEach((pathwaySegment) => {
            // Note: Nodes behaves like an array, but it's a dicitionary
            // with sequential integer indices
            const nodeIndex = Object.entries(builder.map.nodes)
                .find(([id, node]) => node.bigg_id === pathwaySegment.node)[0];
            if (nodeIndex !== undefined) {
                builder.map.new_reaction_for_metabolite(
                    pathwaySegment.reaction,
                    nodeIndex,
                    this.direction
                );
            }
        });

        // Set metabolites node to primary if it's not among the metabolites.
        const metaboliteIdSet = new Set(pathway.map(segment => segment.node));
        // TODO create 'map' fucntion for Object.
        builder.map.nodes = Object.assign({}, ...Object.entries(builder.map.nodes)
            .map(([index, node]) => ({
                    [index]: {
                        ...node,
                        node_is_primary: metaboliteIdSet.has(node.bigg_id)
                    },
            })))


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

    buildMap(model, productName, target) {
        const product = model.metabolites.find(m => m.name === productName);
        const pathway = escher.PathwayGraph.sortedReactionsProducts(model.reactions, product.id)
        // Move to utility module
        const reactionsById = Object.assign({}, ...model.reactions.map(r => ({ [r.id]: r })));

        const builder = escher.Builder(
            null,
            {
                ...model,
                reactions: pathway
                    .map(segment => ({
                        ...segment,
                        reaction: reactionsById[segment.reaction]
                    }))
                    .map((segment) => (segment.reaction.metabolites[segment.node] > 0 
                        ? this.reverseReaction(segment.reaction) : segment.reaction)),
            },
            null,
            target,
            this.options
        );
        this.addReactions(builder, pathway);
        return {
            builder,
            pathway,
        }
    }
}

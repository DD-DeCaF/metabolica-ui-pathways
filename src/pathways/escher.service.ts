import * as escher from 'escher-vis'
import * as d3 from 'd3';
import 'jquery';

export class EscherService {
	direction: number;
	startCoordinates: any;
	options: any;
	metabolitesNames: any[];
	reactions: any[];
	self: EscherService;

	constructor() {
		this.direction = -90;
		this.startCoordinates = {x: 0, y: 0};
		this.metabolitesNames = [];
		this.reactions = [];
		this.self = this;
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
			first_load_callback: () => {
				let currentThis = eval('this');
				for (let i = this.reactions.length - 1; i >= 0; i -= 1) {
					if (i === this.reactions.length - 1) {
						currentThis.map.new_reaction_from_scratch(
							this.reactions[i].id,
							this.startCoordinates,
							this.direction
						);
					} else {
						for (let k in currentThis.map.nodes) {
							if (currentThis.map.nodes[k].name === this.metabolitesNames[i]) {
								currentThis.map.new_reaction_for_metabolite(
									this.reactions[i].id,
									k,
									this.direction);
								break;
							}
						}
					}
				}
				for (let n in currentThis.map.nodes) {
					currentThis.map.nodes[n].node_is_primary =
						(this.metabolitesNames.indexOf(currentThis.map.nodes[n].name) != -1);
				}
				currentThis.map.draw_everything();
				currentThis.map.zoom_extent_nodes();
				currentThis.map.select_none();
			}
		}
	};

	alignReactions(data) {
		let allReactions = {};
		for (let i in data.model.reactions) {
			allReactions[data.model.reactions[i].id] = data.model.reactions[i];
		}
		let sortedReactions = data.reactions;
		for (let i in sortedReactions) {
			let reaction = allReactions[sortedReactions[i].id];
			if (reaction.metabolites[data.primary_nodes[i].id] > 0) {
				for (let k in reaction.metabolites) {
					reaction.metabolites[k] *= -1;
				}
			}
		}
		return data.model;
	}

	buildMap(data, controller_id) {
		this.metabolitesNames = [];
		data.primary_nodes.forEach(
			(value) => this.metabolitesNames.push(value.name)
		);
		this.reactions = data.reactions;
		escher.Builder(
			null,
			this.alignReactions(data),
			null,
			d3.select('#' + controller_id),
			this.options
		);
	}
}

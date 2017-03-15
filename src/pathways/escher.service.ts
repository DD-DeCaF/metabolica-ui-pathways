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
		this.startCoordinates = {x: 300, y: 1000};
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
				var currentThis = eval('this');
				for (var i = this.self.reactions.length - 1; i >= 0; i -= 1) {
					if (i === this.self.reactions.length - 1) {
						currentThis.map.new_reaction_from_scratch(this.self.reactions[i].id, this.self.startCoordinates, this.self.direction);
					} else {
						for (var k in currentThis.map.nodes) {
							if (currentThis.map.nodes[k].name === this.self.metabolitesNames[i]) {
								currentThis.map.new_reaction_for_metabolite(this.self.reactions[i].id, k, this.self.direction);
								break;
							}
						}
					}
				}
				for (var n in currentThis.map.nodes) {
					currentThis.map.nodes[n].node_is_primary = (this.self.metabolitesNames.indexOf(currentThis.map.nodes[n].name) != -1);
				}
				currentThis.map.draw_everything();
				currentThis.map.zoom_extent_nodes();
				currentThis.map.select_none();
			}
		}
	};

	alignReactions(data) {
		var model = data.model;
		for (var i in data.primary_nodes) {
			for (var j in model.reactions) {
				if (model.reactions[j].id === data.reactions[i].id) {
					if (model.reactions[j].metabolites[data.primary_nodes[i].id] > 0) {
						for (var k in model.reactions[j].metabolites) {
							model.reactions[j].metabolites[k] *= -1;
						}
					}
				}
			}
		}
		return model;
	}

	buildMap(data, controller_id) {
		data.primary_nodes.forEach(
			(value) => this.metabolitesNames.push(value.name)
		);
		this.reactions = data.reactions;
		escher.Builder(null, this.alignReactions(data), null, d3.select('#' + controller_id), this.options);
	}
}

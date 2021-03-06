import EventService from '@/services/EventService.js';

export const namespaced = true;

export const state = {
	events: [],
	eventsTotal: 0,
	event: {}
};

export const mutations = {
	SET_EVENTS(state, events) {
		state.events = events;
	},
	ADD_EVENT(state, event) {
		state.events.push(event);
	},
	SET_EVENTS_TOTAL(state, eventsTotal) {
		state.eventsTotal = eventsTotal;
	},
	SET_EVENT(state, event) {
		state.event = event;
	}
};

export const actions = {
	fetchEvents({ commit, dispatch }, { perPage, page }) {
		EventService.getEvents(perPage, page)
			.then(response => {
				commit('SET_EVENTS_TOTAL', parseInt(response.headers['x-total-count']));
				commit('SET_EVENTS', response.data);
			})
			.catch(error => {
				const notification = {
					type: 'error',
					message: 'There was a problem fetching events: ' + error.message
				};
				dispatch('notification/add', notification, { root: true });
			});
	},
	createEvent({ commit, dispatch }, event) {
		return EventService.postEvent(event)
			.then(() => {
				commit('ADD_EVENT', event);
				const notification = {
					type: 'success',
					message: 'Your event has been created!'
				};
				dispatch('notification/add', notification, { root: true });
			})
			.catch(error => {
				const notification = {
					type: 'error',
					message: 'There was a problem creating your event: ' + error.message
				};
				dispatch('notification/add', notification, { root: true });
				throw error;
			});
	},
	fetchEvent({ commit, getters, dispatch }, id) {
		// Send in the getters
		let event = getters.getEventById(id); // See if we already have this event

		if (event) {
			// If we do, set the event
			commit('SET_EVENT', event);
		} else {
			// If not, get it with the API.
			EventService.getEvent(id)
				.then(response => {
					commit('SET_EVENT', response.data);
				})
				.catch(error => {
					const notification = {
						type: 'error',
						message: 'There was a problem fetching an event: ' + error.message
					};
					dispatch('notification/add', notification, { root: true });
				});
		}
	}
};

export const getters = {
	getEventById: state => id => {
		return state.events.find(event => event.id === id);
	}
};

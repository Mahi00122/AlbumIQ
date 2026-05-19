import { api } from '../lib/api';

export async function listEvents() {
  const { data } = await api.get('/events/');
  return data;
}

export async function getEventByCode(eventCode) {
  const { data } = await api.get(`/events/${eventCode}/`, { skipAuth: true });
  return data;
}

export async function createEvent(payload) {
  const { data } = await api.post('/events/', payload);
  return data;
}

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import {
  fetchEvents,
  fetchEventById,
  fetchUpcomingEvents,
  fetchMyEvents,
  createEvent,
  updateEvent,
  publishEvent,
  deleteEvent,
  setFilters,
  clearFilters,
} from '../store/eventSlice';
import { CreateEventRequest, UpdateEventRequest } from '../types/event.types';

export function useEvents() {
  const dispatch = useDispatch<AppDispatch>();
  const { events, selectedEvent, upcomingEvents, myEvents, loading, error, pagination, filters } = useSelector(
    (state: RootState) => state.events
  );

  return {
    events,
    selectedEvent,
    upcomingEvents,
    myEvents,
    loading,
    error,
    pagination,
    filters,

    getEvents: (page?: number, limit?: number, filtersData?: any) =>
      dispatch(fetchEvents({ page, limit, filters: filtersData })),

    getEventById: (id: number) => dispatch(fetchEventById(id)),

    getUpcomingEvents: (limit?: number) => dispatch(fetchUpcomingEvents(limit)),

    getMyEvents: () => dispatch(fetchMyEvents()),

    createEvent: (data: CreateEventRequest) => dispatch(createEvent(data)),

    updateEvent: (id: number, data: UpdateEventRequest) => dispatch(updateEvent({ id, data })),

    publishEvent: (id: number) => dispatch(publishEvent(id)),

    deleteEvent: (id: number) => dispatch(deleteEvent(id)),

    setFilters: (newFilters: any) => dispatch(setFilters(newFilters)),

    clearFilters: () => dispatch(clearFilters()),
  };
}

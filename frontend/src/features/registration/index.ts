export { default as registrationReducer } from './store/registrationSlice';
export * as registrationActions from './store/registrationSlice';

export { registrationService } from './services/registrationService';

export type { Registration, AttendanceStats } from './types/registration.types';
export { REGISTRATION_STATUSES, REGISTRATION_STATUS_COLORS } from './types/registration.types';

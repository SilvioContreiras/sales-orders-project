import { call, put, takeEvery } from 'redux-saga/effects';
import { queryClient } from '@/shared/api/queryClient';
import { queryKeys } from '@/shared/api/queryKeys';
import { notify } from '@/app/store/notificationsSlice';
import { recordAuditEvent } from './actions';
import { createAuditEvent } from './api';

/**
 * Persists an audit event whenever a relevant domain change is dispatched.
 * Running this as a saga keeps audit logging as a cross-cutting side effect,
 * fully decoupled from the feature mutations that trigger it.
 */
function* handleRecordAuditEvent(action: ReturnType<typeof recordAuditEvent>) {
  try {
    yield call(createAuditEvent, action.payload);
    yield call([queryClient, 'invalidateQueries'], { queryKey: queryKeys.audit.all });
  } catch {
    yield put(notify({ variant: 'error', message: 'Failed to record audit event' }));
  }
}

export function* auditSaga() {
  yield takeEvery(recordAuditEvent.type, handleRecordAuditEvent);
}

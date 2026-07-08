import { all, fork } from 'redux-saga/effects';
import { auditSaga } from '@/features/audit/saga';

/**
 * Root saga. Feature sagas (e.g. the audit trail) are registered here so that
 * global side effects live in one predictable place.
 */
export function* rootSaga() {
  yield all([fork(auditSaga)]);
}

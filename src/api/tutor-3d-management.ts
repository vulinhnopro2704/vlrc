import apiClient from './api-client';

const TUTOR_BASE_PATH = 'tutor/sessions';

export const createTutorSession = (payload: Tutor3DManagement.CreateTutorSessionPayload) =>
  apiClient.post(TUTOR_BASE_PATH, { json: payload }).json<Tutor3DManagement.TutorSessionResponse>();

export const getTutorSession = (sessionId: string) =>
  apiClient.get(`${TUTOR_BASE_PATH}/${sessionId}`).json<Tutor3DManagement.TutorSessionResponse>();

export const interactTutorSession = (
  sessionId: string,
  payload: Tutor3DManagement.InteractTutorPayload
) =>
  apiClient
    .post(`${TUTOR_BASE_PATH}/${sessionId}/interact`, { json: payload })
    .json<Tutor3DManagement.TutorInteractionResponse>();

export const interactVoiceTutorSession = (
  sessionId: string,
  payload: Tutor3DManagement.InteractVoiceTutorPayload
) =>
  apiClient
    .post(`${TUTOR_BASE_PATH}/${sessionId}/interact-voice`, { json: payload })
    .json<Tutor3DManagement.TutorInteractionResponse>();

export const interruptTutorSession = (sessionId: string) =>
  apiClient
    .post(`${TUTOR_BASE_PATH}/${sessionId}/interrupt`)
    .json<Tutor3DManagement.InterruptTutorSessionResponse>();

export const endTutorSession = (sessionId: string) =>
  apiClient
    .post(`${TUTOR_BASE_PATH}/${sessionId}/end`)
    .json<Tutor3DManagement.EndTutorSessionResponse>();

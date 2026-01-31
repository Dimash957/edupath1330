
import { User, AssessmentResult, RoadmapStep } from '../types';
import { server } from './server';

/**
 * EduPathAPI - High-level API client for the frontend.
 * Provides a clean abstraction for all "server" communication.
 */
export const EduPathAPI = {
  auth: {
    login: (email: string) => server.authenticate(email),
    logout: () => server.clearSession(),
    checkSession: () => server.getCurrentSession(),
  },
  assessment: {
    get: (email: string) => server.getAssessment(email),
    save: (email: string, result: AssessmentResult) => server.saveAssessment(email, result),
  },
  roadmap: {
    get: (email: string) => server.getRoadmap(email),
    update: (email: string, steps: RoadmapStep[]) => server.updateRoadmap(email, steps),
  },
  shortlist: {
    get: (email: string) => server.getShortlist(email),
    toggle: (email: string, uniId: string) => server.toggleShortlist(email, uniId),
  }
};

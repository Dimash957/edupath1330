
import { User, AssessmentResult, RoadmapStep } from '../types';

const DB_KEYS = {
  CURRENT_USER: 'edupath_current_user',
  USERS: 'edupath_users',
  ASSESSMENTS: 'edupath_assessments',
  ROADMAPS: 'edupath_roadmaps',
  SHORTLISTS: 'edupath_shortlists',
};

class Database {
  private get<T>(key: string, defaultValue: T): T {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }

  private set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Session Management
  getCurrentUser(): User | null {
    return this.get<User | null>(DB_KEYS.CURRENT_USER, null);
  }

  setCurrentUser(user: User | null) {
    this.set(DB_KEYS.CURRENT_USER, user);
    if (user) {
      const users = this.get<Record<string, User>>(DB_KEYS.USERS, {});
      users[user.email] = user;
      this.set(DB_KEYS.USERS, users);
    }
  }

  // Assessment Persistence
  saveAssessment(email: string, result: AssessmentResult) {
    const assessments = this.get<Record<string, AssessmentResult>>(DB_KEYS.ASSESSMENTS, {});
    assessments[email] = result;
    this.set(DB_KEYS.ASSESSMENTS, assessments);
  }

  getAssessment(email: string): AssessmentResult | null {
    const assessments = this.get<Record<string, AssessmentResult>>(DB_KEYS.ASSESSMENTS, {});
    return assessments[email] || null;
  }

  // Roadmap Persistence
  saveRoadmap(email: string, steps: RoadmapStep[]) {
    const roadmaps = this.get<Record<string, RoadmapStep[]>>(DB_KEYS.ROADMAPS, {});
    roadmaps[email] = steps;
    this.set(DB_KEYS.ROADMAPS, roadmaps);
  }

  getRoadmap(email: string): RoadmapStep[] | null {
    const roadmaps = this.get<Record<string, RoadmapStep[]>>(DB_KEYS.ROADMAPS, {});
    return roadmaps[email] || null;
  }

  // Shortlist Persistence
  toggleShortlist(email: string, uniId: string) {
    const shortlists = this.get<Record<string, string[]>>(DB_KEYS.SHORTLISTS, {});
    const list = shortlists[email] || [];
    const index = list.indexOf(uniId);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(uniId);
    }
    shortlists[email] = list;
    this.set(DB_KEYS.SHORTLISTS, shortlists);
    return list;
  }

  getShortlist(email: string): string[] {
    const shortlists = this.get<Record<string, string[]>>(DB_KEYS.SHORTLISTS, {});
    return shortlists[email] || [];
  }

  clearSession() {
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
  }
}

export const db = new Database();

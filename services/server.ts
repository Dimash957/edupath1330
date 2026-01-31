
import { User, AssessmentResult, RoadmapStep } from '../types';

/**
 * MockServer - Simulates a real-world backend server.
 * Handles persistence via localStorage but exposes an async interface with latency.
 */
class MockServer {
  private static instance: MockServer;
  private latencyRange = [600, 1200];

  private constructor() {}

  public static getInstance(): MockServer {
    if (!MockServer.instance) {
      MockServer.instance = new MockServer();
    }
    return MockServer.instance;
  }

  private simulateNetworkDelay(): Promise<void> {
    const delay = Math.floor(Math.random() * (this.latencyRange[1] - this.latencyRange[0] + 1)) + this.latencyRange[0];
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private getFromDB<T>(key: string): T | null {
    const data = localStorage.getItem(`cloud_db_${key}`);
    return data ? JSON.parse(data) : null;
  }

  private saveToDB(key: string, data: any): void {
    localStorage.setItem(`cloud_db_${key}`, JSON.stringify(data));
  }

  // --- API Endpoints ---

  async authenticate(email: string): Promise<User> {
    await this.simulateNetworkDelay();
    const user: User = { email, name: email.split('@')[0], isVerified: true };
    this.saveToDB('current_session', user);
    return user;
  }

  async getAssessment(email: string): Promise<AssessmentResult | null> {
    await this.simulateNetworkDelay();
    const assessments = this.getFromDB<Record<string, AssessmentResult>>('assessments') || {};
    return assessments[email] || null;
  }

  async saveAssessment(email: string, result: AssessmentResult): Promise<void> {
    await this.simulateNetworkDelay();
    const assessments = this.getFromDB<Record<string, AssessmentResult>>('assessments') || {};
    assessments[email] = result;
    this.saveToDB('assessments', assessments);
  }

  async getRoadmap(email: string): Promise<RoadmapStep[] | null> {
    await this.simulateNetworkDelay();
    const roadmaps = this.getFromDB<Record<string, RoadmapStep[]>>('roadmaps') || {};
    return roadmaps[email] || null;
  }

  async updateRoadmap(email: string, steps: RoadmapStep[]): Promise<void> {
    await this.simulateNetworkDelay();
    const roadmaps = this.getFromDB<Record<string, RoadmapStep[]>>('roadmaps') || {};
    roadmaps[email] = steps;
    this.saveToDB('roadmaps', roadmaps);
  }

  async getShortlist(email: string): Promise<string[]> {
    await this.simulateNetworkDelay();
    const shortlists = this.getFromDB<Record<string, string[]>>('shortlists') || {};
    return shortlists[email] || [];
  }

  async toggleShortlist(email: string, uniId: string): Promise<string[]> {
    await this.simulateNetworkDelay();
    const shortlists = this.getFromDB<Record<string, string[]>>('shortlists') || {};
    const list = shortlists[email] || [];
    const index = list.indexOf(uniId);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(uniId);
    }
    shortlists[email] = list;
    this.saveToDB('shortlists', shortlists);
    return list;
  }

  async clearSession(): Promise<void> {
    await this.simulateNetworkDelay();
    localStorage.removeItem('cloud_db_current_session');
  }

  async getCurrentSession(): Promise<User | null> {
    await this.simulateNetworkDelay();
    return this.getFromDB<User | null>('current_session');
  }
}

export const server = MockServer.getInstance();

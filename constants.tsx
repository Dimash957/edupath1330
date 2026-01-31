
import { University, RoadmapStep } from './types';

export const MOCK_UNIVERSITIES: University[] = [
  {
    id: '1',
    name: 'Tech Horizon University',
    location: 'Silicon Valley, USA',
    region: 'Americas',
    rating: 4.8,
    programs: ['Computer Science', 'Data Science', 'AI Engineering'],
    requirements: ['SAT: 1450+', 'IELTS: 7.5', 'Physics & Math HL'],
    minSat: 1450,
    minIelts: 7.5,
    feeRange: '$45,000 - $60,000/year',
    placementRate: '98%',
    duration: '4 Years',
    programType: 'Bachelor',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'International Business Academy',
    location: 'London, UK',
    region: 'Europe',
    rating: 4.6,
    programs: ['Global Management', 'Economics', 'FinTech'],
    requirements: ['IB: 38+', 'Business Portfolio', 'Interview'],
    minSat: 1300,
    minIelts: 7.0,
    feeRange: '£25,000 - £35,000/year',
    placementRate: '94%',
    duration: '3 Years',
    programType: 'Bachelor',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    name: 'Art & Design Institute',
    location: 'Paris, France',
    region: 'Europe',
    rating: 4.9,
    programs: ['Digital Arts', 'Fashion Design', 'UX Research'],
    requirements: ['Creative Portfolio', 'French B2 (optional)', 'Foundation Year'],
    minSat: 1200,
    minIelts: 6.5,
    feeRange: '€15,000 - €22,000/year',
    placementRate: '89%',
    duration: '3 Years',
    programType: 'Bachelor',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    name: 'Sydney Innovation Hub',
    location: 'Sydney, Australia',
    region: 'Oceania',
    rating: 4.7,
    programs: ['Marine Biology', 'Sustainable Energy', 'Robotics'],
    requirements: ['ATAR: 90+', 'IELTS: 7.0'],
    minSat: 1350,
    minIelts: 7.0,
    feeRange: 'A$35,000/year',
    placementRate: '92%',
    duration: '4 Years',
    programType: 'Bachelor',
    image: 'https://images.unsplash.com/photo-1498243639359-2cee349524b1?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    name: 'Global Tech Master’s College',
    location: 'Berlin, Germany',
    region: 'Europe',
    rating: 4.5,
    programs: ['Advanced AI', 'Cybersecurity', 'Cloud Computing'],
    requirements: ['Bachelor Degree', 'IELTS: 7.0'],
    minSat: 0,
    minIelts: 7.0,
    feeRange: '€12,000/year',
    placementRate: '97%',
    duration: '2 Years',
    programType: 'Master',
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    name: 'Toronto Graduate School',
    location: 'Toronto, Canada',
    region: 'Americas',
    rating: 4.4,
    programs: ['MBA', 'Public Policy', 'Social Sciences'],
    requirements: ['Bachelor Degree', 'GRE/GMAT'],
    minSat: 0,
    minIelts: 7.5,
    feeRange: 'C$40,000/year',
    placementRate: '91%',
    duration: '1-2 Years',
    programType: 'Master',
    image: 'https://images.unsplash.com/photo-1525921429624-479b6a29d840?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_ROADMAP: RoadmapStep[] = [
  { id: '1', title: 'Collect Recommendation Letters', date: '2024-03-15', completed: true, type: 'Document' },
  { id: '2', title: 'SAT Final Test Date', date: '2024-05-10', completed: false, type: 'Exam' },
  { id: '3', title: 'Submit Early Action Applications', date: '2024-11-01', completed: false, type: 'Submission' },
  { id: '4', title: 'Receive Acceptance Decisions', date: '2025-01-20', completed: false, type: 'Result' }
];

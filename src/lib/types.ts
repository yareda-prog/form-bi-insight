export interface SurveyField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'boolean';
  options?: string[];
  required?: boolean;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  fields: SurveyField[];
}

export interface Submission {
  id: string;
  surveyId: string;
  data: Record<string, any>;
  timestamp: string;
  location?: { lat: number; lng: number };
}

export const SAMPLE_SURVEY: Survey = {
  id: 'health-survey-001',
  title: 'Community Health Assessment 2024',
  description: 'Regional data collection for primary healthcare access and nutritional status.',
  fields: [
    { id: 'region', label: 'Region', type: 'select', options: ['North', 'South', 'East', 'West', 'Central'], required: true },
    { id: 'household_size', label: 'Household Size', type: 'number', required: true },
    { id: 'primary_water_source', label: 'Primary Water Source', type: 'select', options: ['Piped', 'Well', 'River', 'Rainwater', 'Bottled'], required: true },
    { id: 'has_electricity', label: 'Access to Electricity', type: 'boolean' },
    { id: 'daily_meals', label: 'Average Meals per Day', type: 'number', required: true },
    { id: 'date_collected', label: 'Collection Date', type: 'date', required: true }
  ]
};

export const MOCK_SUBMISSIONS: Submission[] = [
  { id: '1', surveyId: 'health-survey-001', timestamp: '2024-03-01T10:00:00Z', data: { region: 'North', household_size: 5, primary_water_source: 'Well', has_electricity: false, daily_meals: 2, date_collected: '2024-03-01' } },
  { id: '2', surveyId: 'health-survey-001', timestamp: '2024-03-02T11:30:00Z', data: { region: 'South', household_size: 3, primary_water_source: 'Piped', has_electricity: true, daily_meals: 3, date_collected: '2024-03-02' } },
  { id: '3', surveyId: 'health-survey-001', timestamp: '2024-03-02T14:15:00Z', data: { region: 'East', household_size: 7, primary_water_source: 'River', has_electricity: false, daily_meals: 1, date_collected: '2024-03-02' } },
  { id: '4', surveyId: 'health-survey-001', timestamp: '2024-03-03T09:45:00Z', data: { region: 'West', household_size: 4, primary_water_source: 'Piped', has_electricity: true, daily_meals: 3, date_collected: '2024-03-03' } },
  { id: '5', surveyId: 'health-survey-001', timestamp: '2024-03-04T16:20:00Z', data: { region: 'North', household_size: 6, primary_water_source: 'Well', has_electricity: true, daily_meals: 2, date_collected: '2024-03-04' } },
  { id: '6', surveyId: 'health-survey-001', timestamp: '2024-03-05T08:00:00Z', data: { region: 'Central', household_size: 2, primary_water_source: 'Bottled', has_electricity: true, daily_meals: 3, date_collected: '2024-03-05' } },
  { id: '7', surveyId: 'health-survey-001', timestamp: '2024-03-05T12:00:00Z', data: { region: 'East', household_size: 8, primary_water_source: 'River', has_electricity: false, daily_meals: 2, date_collected: '2024-03-05' } },
  { id: '8', surveyId: 'health-survey-001', timestamp: '2024-03-06T10:10:00Z', data: { region: 'North', household_size: 4, primary_water_source: 'Piped', has_electricity: true, daily_meals: 3, date_collected: '2024-03-06' } },
];
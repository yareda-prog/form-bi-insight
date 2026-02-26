import React, { useState } from 'react';
import { SAMPLE_SURVEY, Submission } from '../lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { ClipboardCheck, ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
  onSubmit: (data: any) => void;
}

export const Collector: React.FC<Props> = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submission: Omit<Submission, 'id'> = {
      surveyId: SAMPLE_SURVEY.id,
      timestamp: new Date().toISOString(),
      data: formData,
    };
    onSubmit(submission);
    toast.success('Form submitted successfully!');
    setFormData({});
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">KoboCollector Mobile</h1>
      </div>

      <Card>
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="text-blue-600" />
            {SAMPLE_SURVEY.title}
          </CardTitle>
          <CardDescription>{SAMPLE_SURVEY.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {SAMPLE_SURVEY.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-sm font-semibold">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>
                
                {field.type === 'select' ? (
                  <select
                    id={field.id}
                    required={field.required}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  >
                    <option value="">Select an option</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'boolean' ? (
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name={field.id} 
                        checked={formData[field.id] === true}
                        onChange={() => handleChange(field.id, true)} 
                      /> Yes
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name={field.id} 
                        checked={formData[field.id] === false}
                        onChange={() => handleChange(field.id, false)} 
                      /> No
                    </label>
                  </div>
                ) : (
                  <Input
                    id={field.id}
                    type={field.type}
                    required={field.required}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                )}
              </div>
            ))}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Submit Record
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
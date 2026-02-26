import React, { useState } from 'react';
import { Submission, SAMPLE_SURVEY } from '../lib/types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table';
import { Button } from './ui/button';
import { Download, Search, Trash2 } from 'lucide-react';
import { Input } from './ui/input';

interface Props {
  submissions: Submission[];
  onDelete: (id: string) => void;
}

export const SubmissionList: React.FC<Props> = ({ submissions, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubmissions = submissions.filter(s => 
    Object.values(s.data).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const exportCSV = () => {
    const headers = ['ID', 'Timestamp', ...SAMPLE_SURVEY.fields.map(f => f.label)];
    const rows = submissions.map(s => [
      s.id,
      s.timestamp,
      ...SAMPLE_SURVEY.fields.map(f => s.data[f.id])
    ]);
    
    const newline = String.fromCharCode(10);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join(newline);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "kobo_data_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Data Management</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder="Search records..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Submission Time</TableHead>
              {SAMPLE_SURVEY.fields.map(f => (
                <TableHead key={f.id}>{f.label}</TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="text-xs text-slate-500">
                    {new Date(s.timestamp).toLocaleString()}
                  </TableCell>
                  {SAMPLE_SURVEY.fields.map(f => (
                    <TableCell key={f.id}>
                      {typeof s.data[f.id] === 'boolean' 
                        ? (s.data[f.id] ? 'Yes' : 'No') 
                        : s.data[f.id]
                      }
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDelete(s.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={SAMPLE_SURVEY.fields.length + 2} className="text-center py-10 text-slate-400">
                  No submissions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
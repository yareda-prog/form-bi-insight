import React, { useState } from 'react';
import { MOCK_SUBMISSIONS, Submission } from './lib/types';
import { Collector } from './components/Collector';
import { PowerBiDashboard } from './components/PowerBiDashboard';
import { SubmissionList } from './components/SubmissionList';
import { Button } from './components/ui/button';
import { LayoutDashboard, ClipboardList, Database, Globe, Smartphone, BarChart3, Info } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

type View = 'landing' | 'collect' | 'data' | 'dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);

  const handleAddSubmission = (newSub: Omit<Submission, 'id'>) => {
    const submissionWithId = {
      ...newSub,
      id: Math.random().toString(36).substr(2, 9)
    };
    setSubmissions([submissionWithId, ...submissions]);
    setView('landing');
  };

  const handleDelete = (id: string) => {
    setSubmissions(submissions.filter(s => s.id !== id));
    toast.info('Submission deleted');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Toaster position="top-right" />
      
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setView('landing')}
            >
              <div className="bg-blue-600 p-2 rounded-lg">
                <Globe className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">KoboImpact</span>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <NavButton active={view === 'collect'} onClick={() => setView('collect')} icon={<Smartphone size={18} />} label="Collect Data" />
              <NavButton active={view === 'data'} onClick={() => setView('data')} icon={<Database size={18} />} label="Manage Data" />
              <NavButton active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<BarChart3 size={18} />} label="BI Dashboard" />
            </div>

            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setView('landing')}>
                <Info size={20} />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-8">
                <div className="space-y-6 text-center lg:text-left">
                  <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                    Bridge the gap from <span className="text-blue-600">Field Data</span> to <span className="text-emerald-600">Action</span>.
                  </h1>
                  <p className="text-lg text-slate-500 max-w-xl mx-auto lg:mx-0">
                    A comprehensive suite for mobile data collection with KoboToolbox-inspired tools and professional Power BI visualizations for humanitarian and development projects.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8" onClick={() => setView('collect')}>
                      Start Collection
                    </Button>
                    <Button size="lg" variant="outline" className="h-12 px-8" onClick={() => setView('dashboard')}>
                      View Live Insights
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/177e8b48-aa22-4460-9307-e507c5df2e15/hero-collecting-data-68d48d86-1772133864368.webp" 
                    alt="Field Collection" 
                    className="rounded-3xl shadow-2xl object-cover aspect-video"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border hidden md:block">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-100 rounded-full">
                        <ClipboardList className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Recent Activity</p>
                        <p className="text-sm font-semibold">Updates synced via OData API</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                  title="Mobile-First Collection" 
                  desc="Robust offline-capable forms for remote environments."
                  icon={<Smartphone className="text-blue-600" />}
                />
                <FeatureCard 
                  title="Real-time Synchronization" 
                  desc="Instant data sync to the cloud with OData integration."
                  icon={<Globe className="text-emerald-600" />}
                />
                <FeatureCard 
                  title="Power BI Ready" 
                  desc="Automated reporting pipelines for stakeholders."
                  icon={<LayoutDashboard className="text-purple-600" />}
                />
              </div>
            </motion.div>
          )}

          {view === 'collect' && (
            <motion.div 
              key="collect"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Collector onBack={() => setView('landing')} onSubmit={handleAddSubmission} />
            </motion.div>
          )}

          {view === 'data' && (
            <motion.div 
              key="data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SubmissionList submissions={submissions} onDelete={handleDelete} />
            </motion.div>
          )}

          {view === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <PowerBiDashboard submissions={submissions} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
      active ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
    }`}
  >
    {icon}
    {label}
  </button>
);

const FeatureCard = ({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) => (
  <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
    <div className="mb-4 inline-block p-3 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default App;
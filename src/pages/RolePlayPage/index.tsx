import { useState, useRef } from 'react';
import { useScenariosQuery } from '@/api/roleplay-management';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageCircle, Play } from 'lucide-react';
import CreateScenarioModal from './CreateScenarioModal';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const RolePlayPage = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: scenarios, isLoading } = useScenariosQuery();

  useGSAP(() => {
    if (isLoading) return;
    
    gsap.from('.hero-content', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.scenario-card', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.2
    });
  }, { dependencies: [isLoading], scope: containerRef });

  const handleStartScenario = (scenarioId: string) => {
    toast.info(`Bắt đầu kịch bản: ${scenarioId}`);
    // NOTE: Cần navigate sang Tutor3DPage hoặc UI chat mới
  };

  const handleFreeTalk = () => {
    toast.info('Bắt đầu Free Talk');
    // NOTE: Cần navigate sang Tutor3DPage
  };

  return (
    <div ref={containerRef} className="min-h-[calc(100vh-4rem)] bg-slate-950 relative overflow-hidden text-slate-50 w-full">
      {/* Background with glassmorphism / liquid feel */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.15),transparent_35%),radial-gradient(circle_at_75%_10%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(15,23,42,0.9),rgba(2,6,23,1))] pointer-events-none' />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="hero-content text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            {t('roleplay_title')}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            {t('roleplay_description')}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button size="lg" onClick={() => setIsModalOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6">
              <PlusCircle size={20} />
              {t('roleplay_create_scenario')}
            </Button>
            <Button size="lg" variant="secondary" onClick={handleFreeTalk} className="gap-2 rounded-full px-6 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
              <MessageCircle size={20} />
              {t('roleplay_free_talk')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
             Array.from({ length: 6 }).map((_, i) => (
               <div key={i} className="h-48 rounded-2xl bg-slate-800/50 animate-pulse border border-slate-700/50" />
             ))
          ) : (
            scenarios?.map((scenario) => (
              <Card key={scenario.id} className="scenario-card bg-slate-900/40 backdrop-blur-md border-slate-800/60 hover:border-indigo-500/50 transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {scenario.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400 mt-2 line-clamp-2">
                    {scenario.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    {scenario.level && (
                      <span className="px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                        {t('roleplay_scenario_level', { level: scenario.level })}
                      </span>
                    )}
                    {scenario.topic && (
                      <span className="px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                        {scenario.topic}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2 bg-slate-800 hover:bg-indigo-600 text-slate-200 transition-colors" onClick={() => handleStartScenario(scenario.id)}>
                    <Play size={16} />
                    {t('roleplay_scenario_start')}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>

      <CreateScenarioModal 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default RolePlayPage;

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons/Icons';

export const ScenarioSelection = ({
  scenarios,
  isLoading,
  handleStartScenario,
  isStartPending,
  startVariables
}: {
  scenarios: RoleplayManagement.Scenario[] | undefined;
  isLoading: boolean;
  handleStartScenario: (scenario: RoleplayManagement.Scenario) => void;
  isStartPending: boolean;
  startVariables: { scenarioId: string } | undefined;
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-52 rounded-2xl bg-slate-900/40 animate-pulse border border-slate-800/40" />
        ))
      ) : (
        scenarios?.map((scenario) => (
          <Card 
            key={scenario.id} 
            className="scenario-card bg-slate-900/70 backdrop-blur-md border border-slate-800/80 hover:border-indigo-500/80 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] transition-all duration-300 group rounded-2xl"
          >
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                {scenario.title}
              </CardTitle>
              <CardDescription className="text-slate-400 mt-2 line-clamp-3 leading-relaxed text-sm">
                {scenario.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex flex-wrap gap-2">
                {scenario.level && (
                  <span className="px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                    {t('roleplay_scenario_level', { level: scenario.level })}
                  </span>
                )}
                {scenario.topic && (
                  <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                    {scenario.topic}
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button 
                disabled={isStartPending}
                className="w-full gap-2 bg-slate-800/80 border border-slate-700/50 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 text-slate-200 transition-all rounded-xl" 
                onClick={() => handleStartScenario(scenario)}
              >
                {isStartPending && startVariables?.scenarioId === scenario.id ? (
                  <Icons.Loader2 size={16} className="animate-spin" />
                ) : (
                  <Icons.Play size={16} />
                )}
                {t('roleplay_scenario_start')}
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};


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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-44 rounded-2xl bg-slate-900/40 animate-pulse border border-slate-800/40" />
        ))
      ) : (
        scenarios?.map((scenario) => (
          <Card 
            key={scenario.id} 
            className="scenario-card flex flex-col bg-slate-900/70 backdrop-blur-md border border-slate-800/80 hover:border-indigo-500/80 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] transition-all duration-300 group rounded-2xl overflow-hidden"
          >
            {scenario.imageUrl && (
              <div className="w-full h-24 overflow-hidden shrink-0">
                <img src={scenario.imageUrl} alt={scenario.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            )}
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                {scenario.title}
              </CardTitle>
              <CardDescription className="text-slate-400 mt-1 line-clamp-2 leading-relaxed text-[11px]">
                {scenario.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1">
              <div className="flex flex-wrap gap-2">
                {scenario.level && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                    {t('roleplay_scenario_level', { level: scenario.level })}
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 mt-auto">
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

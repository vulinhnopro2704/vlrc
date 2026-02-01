import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Brain,
  BookOpen,
  Headphones,
  PenTool,
  Target,
  Sparkles,
  BarChart3,
  Clock,
  CheckCircle2,
  ChevronRight,
  Play,
  Zap,
  TrendingUp,
  Award,
  Users,
  Calendar
} from 'lucide-react';
import { useState } from 'react';

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-20 lg:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Ung dung FSRS + Machine Learning</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
            Nho lau hon, <br />
            <span className="text-primary">Hoc thong minh hon</span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            He thong hoc tieng Anh dua tren thuat toan FSRS va AI ca nhan hoa. 
            On tap dung thoi diem, ghi nho lau dai - khong can hoc qua nhieu.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-semibold shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30">
              Bat dau mien phi
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
              <Play className="mr-2 h-5 w-5" />
              Xem cach hoat dong
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground">
            Khong can the tin dung - Huy bat cu luc nao
          </p>
        </div>
        
        {/* App Preview Mockup */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative rounded-2xl border bg-card p-4 shadow-2xl">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Flashcard Preview */}
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Flashcard</span>
                  <span className="rounded-full bg-primary/20 px-2 py-1 text-xs font-medium text-primary">Due</span>
                </div>
                <div className="mb-4 text-center">
                  <p className="text-2xl font-bold text-foreground">Perseverance</p>
                  <p className="mt-2 text-muted-foreground">Su kien tri, ben bi</p>
                </div>
                <div className="flex justify-center gap-2">
                  <span className="rounded-lg bg-destructive/10 px-3 py-1 text-xs text-destructive">Quen</span>
                  <span className="rounded-lg bg-yellow-500/10 px-3 py-1 text-xs text-yellow-600">Kho</span>
                  <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs text-primary">Tot</span>
                  <span className="rounded-lg bg-green-500/10 px-3 py-1 text-xs text-green-600">De</span>
                </div>
              </div>
              
              {/* Audio Waveform Preview */}
              <div className="rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Nghe - Chep chinh ta</span>
                  <Headphones className="h-4 w-4 text-accent" />
                </div>
                <div className="mb-4 flex items-center justify-center gap-1">
                  {[40, 60, 80, 50, 70, 90, 60, 80, 45, 75, 55, 85].map((h, i) => (
                    <div
                      key={i}
                      className="w-2 rounded-full bg-accent/60"
                      style={{ height: `${h}%`, maxHeight: '60px' }}
                    />
                  ))}
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  {"The key to success is..."}
                </div>
              </div>
              
              {/* Progress Preview */}
              <div className="rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Tien do hom nay</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Tu vung</span>
                      <span className="font-medium">45/50</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-2 w-[90%] rounded-full bg-green-500" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Nghe</span>
                      <span className="font-medium">8/10</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-2 w-[80%] rounded-full bg-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Viet</span>
                      <span className="font-medium">3/5</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-2 w-[60%] rounded-full bg-accent" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Value Propositions Section
const ValuePropositionsSection = () => {
  const features = [
    {
      icon: Brain,
      title: 'FSRS & Spaced Repetition',
      description: 'Thuat toan FSRS tinh toan thoi diem on tap toi uu, giup ban nho lau ma khong can hoc qua nhieu.',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: Sparkles,
      title: 'Machine Learning ca nhan hoa',
      description: 'AI hoc tu hanh vi cua ban de dieu chinh lich on tap, do kho phu hop voi tung nguoi.',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      icon: Headphones,
      title: 'Listening & Reading thuc te',
      description: 'Nghe chep chinh ta, doc hieu bai viet that - ren luyen ky nang thuc chien hang ngay.',
      color: 'text-green-600',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: PenTool,
      title: 'Writing co nhan xet chi tiet',
      description: 'Viet bai theo chu de, nhan gop y tu AI ve ngu phap, tu vung va cach dien dat.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10'
    }
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            Tai sao chon chung toi?
          </h2>
          <p className="text-lg text-muted-foreground">
            Ket hop khoa hoc nhan thuc va cong nghe AI de mang lai hieu qua hoc tap tot nhat
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="group border-0 bg-card shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
              <CardHeader>
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor}`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    {
      step: 1,
      icon: Target,
      title: 'Kiem tra trinh do & muc tieu',
      description: 'Lam bai test nhanh de he thong hieu trinh do va muc tieu hoc cua ban.'
    },
    {
      step: 2,
      icon: Sparkles,
      title: 'AI tao bo tu & lich on ca nhan',
      description: 'Thuat toan FSRS tao lich on tap toi uu, phu hop voi kha nang ghi nho cua ban.'
    },
    {
      step: 3,
      icon: BookOpen,
      title: 'Hoc qua flashcard, nghe, doc, viet',
      description: 'Da dang phuong phap hoc: flashcard, nghe chep, doc dich, viet bai co AI cham.'
    },
    {
      step: 4,
      icon: BarChart3,
      title: 'Theo doi tien do & de xuat tiep theo',
      description: 'Dashboard truc quan hien thi tien bo, AI de xuat buoc tiep theo phu hop.'
    }
  ];

  return (
    <section className="bg-secondary/30 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Cach hoat dong
          </h2>
          <p className="text-lg text-muted-foreground">
            Chi 4 buoc don gian de bat dau hanh trinh hoc tieng Anh hieu qua
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, index) => (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-full bg-border lg:block" style={{ width: 'calc(100% - 2rem)', left: '50%' }} />
                )}
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                      <item.icon className="h-7 w-7" />
                    </div>
                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Science Section
const ScienceSection = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Brain className="h-4 w-4" />
              <span>Khoa hoc dang sau</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl text-balance">
              FSRS - Thuat toan on tap thong minh nhat hien nay
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                <strong className="text-foreground">Spaced Repetition</strong> la phuong phap on tap dua tren "duong cong quen" - ban chi on lai khi sap quen, giup tiet kiem thoi gian toi 90%.
              </p>
              <p className="text-lg leading-relaxed">
                <strong className="text-foreground">FSRS (Free Spaced Repetition Scheduler)</strong> la thuat toan the he moi, chinh xac hon Anki gap 1.5 lan trong viec du doan thoi diem ban sap quen.
              </p>
              <p className="text-lg leading-relaxed">
                <strong className="text-foreground">Machine Learning</strong> trong he thong cua chung toi hoc tu hanh vi cua ban - thoi gian tra loi, do chinh xac, thoi diem hoc - de dieu chinh thuat toan phu hop voi rieng ban.
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">90%</div>
                <div className="text-sm text-muted-foreground">Tiet kiem thoi gian</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1.5x</div>
                <div className="text-sm text-muted-foreground">Chinh xac hon Anki</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">85%</div>
                <div className="text-sm text-muted-foreground">Ty le nho dai han</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-secondary to-accent/5 p-8">
              {/* Forgetting Curve Visualization */}
              <div className="rounded-xl bg-card p-6 shadow-lg">
                <h4 className="mb-4 font-semibold text-foreground">Duong cong quen & Spaced Repetition</h4>
                <div className="relative h-48">
                  {/* Y axis */}
                  <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-xs text-muted-foreground">
                    <span>100%</span>
                    <span>50%</span>
                    <span>0%</span>
                  </div>
                  {/* Chart area */}
                  <div className="ml-8 h-full">
                    <svg viewBox="0 0 300 150" className="h-full w-full">
                      {/* Forgetting curve without review */}
                      <path
                        d="M0,10 Q50,30 100,80 T200,120 T300,140"
                        fill="none"
                        stroke="hsl(0, 70%, 60%)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      {/* With spaced repetition */}
                      <path
                        d="M0,10 Q20,20 40,10 Q60,20 80,10 Q100,20 120,10 Q160,25 200,15 Q260,30 300,20"
                        fill="none"
                        stroke="hsl(175, 70%, 45%)"
                        strokeWidth="3"
                      />
                      {/* Review points */}
                      {[40, 80, 120, 200].map((x, i) => (
                        <circle key={i} cx={x} cy={10} r="5" fill="hsl(30, 90%, 55%)" />
                      ))}
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-6 border-t-2 border-dashed border-red-500" />
                    <span className="text-muted-foreground">Khong on tap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-6 bg-primary" />
                    <span className="text-muted-foreground">Co on tap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-accent" />
                    <span className="text-muted-foreground">On tap</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Learning Experience Section
const LearningExperienceSection = () => {
  const [activeTab, setActiveTab] = useState<'listening' | 'reading' | 'writing'>('listening');

  const experiences = {
    listening: {
      title: 'Nghe - Chep chinh ta',
      description: 'Nghe audio that va chep lai. He thong tu dong kiem tra loi sai, giup ban nhan ra diem yeu ve phat am va tu vung.',
      features: ['Audio tu nguoi ban xu', 'Kiem tra chinh ta tu dong', 'Phan tich loi thuong gap', 'Theo doi tien bo nghe']
    },
    reading: {
      title: 'Doc - Dich tung cau',
      description: 'Doc bai viet va dich tung cau. Hieu sau ngu phap, cau truc cau va cach dung tu trong ngu canh that.',
      features: ['Bai doc theo trinh do', 'Dich tung cau co giai thich', 'Hoc tu vung trong ngu canh', 'Bai tap doc hieu']
    },
    writing: {
      title: 'Viet - Nhan xet chi tiet',
      description: 'Viet bai theo chu de, nhan gop y tu AI ve ngu phap, tu vung, cau truc va phong cach viet.',
      features: ['Chu de da dang', 'AI cham bai chi tiet', 'Goi y cai thien cu the', 'So sanh voi bai mau']
    }
  };

  const current = experiences[activeTab];

  return (
    <section className="bg-secondary/30 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Trai nghiem hoc da chieu
          </h2>
          <p className="text-lg text-muted-foreground">
            Khong chi hoc tu vung - ren luyen dong thoi Nghe, Doc, Viet de thanh thao tieng Anh
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          {/* Tabs */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-xl bg-muted p-1">
              {(['listening', 'reading', 'writing'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab === 'listening' && <Headphones className="h-4 w-4" />}
                  {tab === 'reading' && <BookOpen className="h-4 w-4" />}
                  {tab === 'writing' && <PenTool className="h-4 w-4" />}
                  {tab === 'listening' && 'Nghe'}
                  {tab === 'reading' && 'Doc'}
                  {tab === 'writing' && 'Viet'}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-2xl font-bold text-foreground">{current.title}</h3>
                  <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                    {current.description}
                  </p>
                  <ul className="space-y-3">
                    {current.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Preview */}
                <div className="rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 p-6">
                  {activeTab === 'listening' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Bai nghe #42</span>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">Trung binh</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 py-4">
                        {[30, 50, 70, 40, 80, 60, 90, 50, 70, 45, 85, 55].map((h, i) => (
                          <div
                            key={i}
                            className="w-3 rounded-full bg-primary/60 transition-all"
                            style={{ height: `${h}px` }}
                          />
                        ))}
                      </div>
                      <div className="rounded-lg bg-card p-4">
                        <p className="mb-2 text-sm text-muted-foreground">Nhap nhung gi ban nghe:</p>
                        <div className="rounded border border-input bg-background p-3 text-foreground">
                          The key to success is <span className="bg-red-100 text-red-600 dark:bg-red-900/30">consistancy</span>...
                        </div>
                        <p className="mt-2 text-xs text-destructive">Sai chinh ta: consistency</p>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'reading' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Bai doc: Technology</span>
                        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">B1</span>
                      </div>
                      <div className="rounded-lg bg-card p-4">
                        <p className="mb-3 text-sm leading-relaxed">
                          <span className="bg-primary/20 cursor-pointer">Artificial intelligence</span> is transforming how we work and live.
                        </p>
                        <div className="border-l-2 border-primary pl-3">
                          <p className="text-sm text-muted-foreground">Tri tue nhan tao dang thay doi cach chung ta lam viec va song.</p>
                        </div>
                      </div>
                      <div className="text-center text-sm text-muted-foreground">
                        Bam vao cum tu de xem dich va giai thich
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'writing' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Chu de: My Daily Routine</span>
                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-600">120 tu</span>
                      </div>
                      <div className="rounded-lg bg-card p-4">
                        <p className="text-sm leading-relaxed">
                          I <span className="border-b-2 border-yellow-500">wake up</span> at 6 AM every day. First, I <span className="border-b-2 border-green-500">have breakfast</span>...
                        </p>
                      </div>
                      <div className="space-y-2 rounded-lg bg-primary/5 p-3">
                        <p className="text-xs font-medium text-primary">AI Feedback:</p>
                        <p className="text-xs text-muted-foreground">Tot! Ban dung thoi hien tai don chinh xac. Goi y: Thu them adverbs de bai viet sinh dong hon.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

// Progress Dashboard Section
const ProgressDashboardSection = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Theo doi tien bo ro rang
          </h2>
          <p className="text-lg text-muted-foreground">
            Dashboard truc quan giup ban thay ro tien trinh va dong luc hoc tap
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border bg-card p-6 shadow-xl lg:p-8">
            <div className="grid gap-6 md:grid-cols-4">
              {/* Stat Cards */}
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Memory Strength</span>
                </div>
                <div className="text-3xl font-bold text-foreground">78%</div>
                <div className="mt-1 text-xs text-primary">+5% tuan nay</div>
              </div>
              
              <div className="rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 p-5">
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-muted-foreground">Tu da nho lau</span>
                </div>
                <div className="text-3xl font-bold text-foreground">1,247</div>
                <div className="mt-1 text-xs text-green-600">+89 tu moi</div>
              </div>
              
              <div className="rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  <span className="text-sm text-muted-foreground">Streak</span>
                </div>
                <div className="text-3xl font-bold text-foreground">23</div>
                <div className="mt-1 text-xs text-accent">ngay lien tiep</div>
              </div>
              
              <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-muted-foreground">Thoi gian hoc</span>
                </div>
                <div className="text-3xl font-bold text-foreground">48h</div>
                <div className="mt-1 text-xs text-blue-600">thang nay</div>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="mt-8 rounded-xl bg-secondary/50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-semibold text-foreground">Bieu do tien bo 7 ngay</h4>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Tu vung</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-accent" />
                    <span className="text-muted-foreground">Nghe</span>
                  </div>
                </div>
              </div>
              <div className="flex h-40 items-end justify-between gap-4">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, i) => (
                  <div key={day} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex w-full flex-col gap-1">
                      <div
                        className="w-full rounded-t bg-primary transition-all"
                        style={{ height: `${[60, 80, 45, 90, 70, 55, 85][i]}px` }}
                      />
                      <div
                        className="w-full rounded-b bg-accent transition-all"
                        style={{ height: `${[30, 40, 25, 50, 35, 45, 40][i]}px` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Social Proof Section
const SocialProofSection = () => {
  const testimonials = [
    {
      name: 'Minh Anh',
      role: 'Sinh vien nam 3',
      content: 'Sau 2 thang dung, minh nho duoc hon 800 tu vung va khong bi quen nhu truoc. FSRS that su hieu qua!',
      avatar: 'MA'
    },
    {
      name: 'Duc Tuan',
      role: 'Nhan vien van phong',
      content: 'Tinh nang nghe chep chinh ta giup minh cai thien listening tu 5.5 len 7.0 IELTS chi trong 3 thang.',
      avatar: 'DT'
    },
    {
      name: 'Thu Ha',
      role: 'Freelancer',
      content: 'Giao dien dep, de dung. AI gop y bai viet rat chi tiet, giup minh tu tin hon khi viet email tieng Anh.',
      avatar: 'TH'
    }
  ];

  return (
    <section className="bg-secondary/30 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Nguoi dung noi gi?
          </h2>
          <p className="text-lg text-muted-foreground">
            Hang nghin nguoi da cai thien tieng Anh voi chung toi
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
                <div className="mt-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Award key={star} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary">10,000+</div>
            <div className="mt-1 text-muted-foreground">Nguoi dung</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">2M+</div>
            <div className="mt-1 text-muted-foreground">Tu da hoc</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">95%</div>
            <div className="mt-1 text-muted-foreground">Hai long</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'FSRS la gi va khac gi voi Anki?',
      answer: 'FSRS (Free Spaced Repetition Scheduler) la thuat toan on tap the he moi, duoc phat trien dua tren nghien cuu khoa hoc ve tri nho. So voi thuat toan SM-2 cua Anki, FSRS chinh xac hon 1.5 lan trong viec du doan thoi diem ban sap quen, giup tiet kiem thoi gian on tap dang ke.'
    },
    {
      question: 'Moi ngay can hoc bao lau?',
      answer: 'Chi can 15-20 phut moi ngay la du de thay ket qua. He thong se tu dong dieu chinh luong bai tap phu hop voi thoi gian ban co. Quan trong la hoc deu dan, khong phai hoc nhieu.'
    },
    {
      question: 'Co phu hop cho nguoi moi bat dau khong?',
      answer: 'Hoan toan phu hop! He thong se danh gia trinh do cua ban va tao lo trinh hoc tu co ban. AI se dieu chinh do kho tu tu, dam bao ban khong bi qua tai.'
    },
    {
      question: 'Co ho tro tieng Viet khong?',
      answer: 'Co! Toan bo giao dien va noi dung giai thich deu bang tieng Viet. AI cham bai viet cung ho tro gop y bang tieng Viet de ban de hieu hon.'
    }
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Cau hoi thuong gap
          </h2>
          <p className="text-lg text-muted-foreground">
            Nhung thac mac pho bien ve cach hoc va su dung he thong
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-foreground">{faq.question}</span>
                <ChevronRight
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    openIndex === index ? 'rotate-90' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="border-t px-6 pb-6 pt-4">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Final CTA Section
const FinalCTASection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 py-20 lg:py-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl text-balance">
            Bat dau hanh trinh hoc thong minh ngay hom nay
          </h2>
          <p className="mb-10 text-lg text-primary-foreground/80 md:text-xl">
            Tham gia cung hang nghin nguoi dang hoc tieng Anh hieu qua voi FSRS va AI
          </p>
          
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-7 text-xl font-semibold shadow-xl shadow-black/20 transition-all hover:scale-105 hover:shadow-2xl"
          >
            Bat dau mien phi ngay hom nay
            <ChevronRight className="ml-2 h-6 w-6" />
          </Button>
          
          <p className="mt-6 text-primary-foreground/70">
            Khong can the tin dung - Co the huy bat cu luc nao
          </p>
          
          <div className="mt-12 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <Users className="h-5 w-5" />
              <span>10,000+ nguoi dung</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <Award className="h-5 w-5" />
              <span>4.9/5 danh gia</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <Calendar className="h-5 w-5" />
              <span>Cap nhat thuong xuyen</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Header
const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            VL
          </div>
          <span className="text-xl font-bold text-foreground">VLRC</span>
        </div>
        
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Tinh nang</a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cach hoat dong</a>
          <a href="#science" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Khoa hoc</a>
          <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex">Dang nhap</Button>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Dang ky mien phi</Button>
        </div>
      </div>
    </header>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="border-t bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                VL
              </div>
              <span className="text-xl font-bold text-foreground">VLRC</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Hoc tieng Anh thong minh voi FSRS va AI ca nhan hoa.
            </p>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold text-foreground">San pham</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Tinh nang</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Bang gia</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Cap nhat</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Ho tro</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Huong dan</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Lien he</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Phap ly</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Dieu khoan</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Bao mat</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>2026 VLRC. Moi quyen duoc bao luu.</p>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <div id="features">
          <ValuePropositionsSection />
        </div>
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
        <div id="science">
          <ScienceSection />
        </div>
        <LearningExperienceSection />
        <ProgressDashboardSection />
        <SocialProofSection />
        <div id="faq">
          <FAQSection />
        </div>
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;

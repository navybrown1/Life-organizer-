import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, CheckCircle2, Sparkles, Target, Zap } from "lucide-react";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;

  if (!kimiAuthUrl || !appID) {
    return "/";
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

const features = [
  { icon: CheckCircle2, label: "Tasks", text: "Focus on the right work at the right time." },
  { icon: CalendarDays, label: "Calendar", text: "See your day before it runs away from you." },
  { icon: Target, label: "Goals", text: "Track progress with momentum, not guesswork." },
  { icon: Sparkles, label: "AI", text: "Turn scattered plans into clear next actions." },
];

export default function Login() {
  return (
    <div className="relative min-h-screen overflow-hidden mesh-bg text-white">
      <div className="absolute inset-0 opacity-35 animated-gradient" />
      <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-purple-400/30 blur-3xl float" />
      <div className="absolute right-0 top-10 h-96 w-96 rounded-full bg-cyan-400/25 blur-3xl float" style={{ animationDelay: "1.4s" }} />
      <div className="absolute bottom-0 left-1/2 h-80 w-80 rounded-full bg-pink-400/20 blur-3xl float" style={{ animationDelay: "2.2s" }} />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 lg:px-10">
        <nav className="glass flex items-center justify-between rounded-3xl px-5 py-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="gradient-primary flex h-11 w-11 items-center justify-center rounded-2xl shadow-glow">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">Life Organizer</p>
              <p className="text-lg font-black tracking-tight">Preview Mode</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="hidden border-white/30 bg-white/10 text-white hover:bg-white/20 sm:inline-flex"
            onClick={() => {
              window.location.href = getOAuthUrl();
            }}
          >
            Enter App
          </Button>
        </nav>

        <main className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <section className="max-w-3xl fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-cyan-200" />
              Premium productivity dashboard for real life
            </div>
            <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Organize Your <span className="text-gradient">Perfect Day</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76 sm:text-xl">
              Bring tasks, events, goals, habits, notes, and AI guidance into one clean command center built for momentum.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                variant="gradient"
                className="pulse-glow"
                onClick={() => {
                  window.location.href = getOAuthUrl();
                }}
              >
                Launch Life Organizer
                <Zap className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/10 text-white hover:bg-white/20"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                View Preview Dashboard
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {["Tasks", "Events", "Goals", "Habits"].map((item, index) => (
                <div key={item} className="glass-card rounded-2xl p-4 text-center text-slate-950 hover-lift" style={{ animationDelay: `${index * 90}ms` }}>
                  <p className="text-2xl font-black text-gradient">{index === 0 ? "24" : index === 1 ? "7" : index === 2 ? "12" : "5"}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <Card className="glass-card border-white/40 bg-white/75 text-slate-950 shadow-glow hover-lift">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-8">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-purple-600">Your command center</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">Everything in one place.</h2>
                <p className="mt-3 text-slate-600">
                  This preview runs without database or OAuth secrets, so you can judge the experience before wiring persistence.
                </p>
              </div>

              <div className="space-y-4">
                {features.map((feature) => (
                  <div key={feature.label} className="flex gap-4 rounded-2xl border border-purple-100 bg-white/70 p-4 transition-all hover:border-purple-200 hover:bg-white">
                    <div className="gradient-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg shadow-purple-500/25">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold">{feature.label}</p>
                      <p className="text-sm text-slate-600">{feature.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="mt-8 w-full"
                size="lg"
                variant="gradient"
                onClick={() => {
                  window.location.href = getOAuthUrl();
                }}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

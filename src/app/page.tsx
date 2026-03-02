import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/Hero";
import EventHighlights from "@/components/EventHighlights";
import DepartmentCards from "@/components/DepartmentCards";
import ScheduleTimeline from "@/components/ScheduleTimeline";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-background text-foreground">
        <Hero />
        <EventHighlights />
        <DepartmentCards />
        <ScheduleTimeline />
        <Footer />
      </main>
    </SmoothScroll>
  );
}

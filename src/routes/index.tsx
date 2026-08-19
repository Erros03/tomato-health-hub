import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonProgressBar,
} from "@ionic/react";
import { AppShell } from "@/components/AppShell";
import { useBlightStream } from "@/lib/useBlightStream";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BlightDetect+ | Tomato Blight Detection & Yield Dashboard" },
      {
        name: "description",
        content:
          "Live AI and IoT dashboard for tomato blight detection, classification, automated sorting and yield monitoring powered by YOLO vision and Arduino hardware.",
      },
      { property: "og:title", content: "BlightDetect+ Yield Monitoring Dashboard" },
      {
        property: "og:description",
        content:
          "Track processed tomatoes, healthy yield, blight rejections and classification accuracy in real time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <ClientOnly fallback={null}>
      <DashboardView />
    </ClientOnly>
  );
}

function StatCard({
  label,
  value,
  accent,
  note,
}: {
  label: string;
  value: string | number;
  accent: string;
  note: string;
}) {
  return (
    <IonCard className="bd-metric-card">
      <IonCardContent>
        <div className="bd-metric-label">{label}</div>
        <div className={`bd-metric-value ${accent}`}>{value}</div>
        <IonNote>{note}</IonNote>
      </IonCardContent>
    </IonCard>
  );
}

function Bar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="bd-bar-row">
      <div className="bd-bar-head">
        <span className="bd-metric-label">{label}</span>
        <span className="bd-bar-pct">{pct}%</span>
      </div>
      <IonProgressBar color={color} value={pct / 100} />
    </div>
  );
}

function DashboardView() {
  const { events, metrics } = useBlightStream();
  const { size, ripeness } = metrics;

  return (
    <AppShell title="Yield Monitoring Dashboard">
      <div className="bd-page">
        <section className="bd-hero">
          <div>
            <p className="bd-metric-label">BlightDetect+ · Live line</p>
            <h1 className="bd-hero-title">Yield Monitoring</h1>
          </div>
          <IonBadge color="success" className="bd-live">streaming</IonBadge>
        </section>

        <div className="bd-grid bd-grid-3">
          <StatCard
            label="Total Processed"
            value={metrics.total}
            accent="bd-accent-gray"
            note="Since session start"
          />
          <StatCard
            label="Healthy Yield"
            value={metrics.healthy}
            accent="bd-accent-leaf"
            note={`${metrics.healthyPct}% accepted by sorter`}
          />
          <StatCard
            label="Blight Rejected"
            value={metrics.blighted}
            accent="bd-accent-tomato"
            note={`${metrics.blightPct}% diverted by servo gate`}
          />
        </div>

        <div className="bd-grid bd-grid-2">
          <IonCard className="bd-metric-card">
            <IonCardHeader>
              <IonCardTitle className="bd-card-title">Size Grading</IonCardTitle>
              <IonCardSubtitle>Average diameter {size.avgDiameter} mm</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="bd-chip-row">
                <div className="bd-chip">
                  <span className="bd-chip-value bd-accent-alert">{size.small}</span>
                  <span className="bd-metric-label">Small &lt;52mm</span>
                </div>
                <div className="bd-chip">
                  <span className="bd-chip-value bd-accent-leaf">{size.medium}</span>
                  <span className="bd-metric-label">Medium 52–67mm</span>
                </div>
                <div className="bd-chip">
                  <span className="bd-chip-value bd-accent-gray">{size.large}</span>
                  <span className="bd-metric-label">Large ≥68mm</span>
                </div>
              </div>
              <Bar label="Small" pct={size.smallPct} color="warning" />
              <Bar label="Medium" pct={size.mediumPct} color="success" />
              <Bar label="Large" pct={size.largePct} color="dark" />
            </IonCardContent>
          </IonCard>

          <IonCard className="bd-metric-card">
            <IonCardHeader>
              <IonCardTitle className="bd-card-title">Ripeness Monitoring</IonCardTitle>
              <IonCardSubtitle>Colour-based classification from the vision model</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="bd-chip-row">
                <div className="bd-chip">
                  <span className="bd-chip-value bd-accent-tomato">{ripeness.ripe}</span>
                  <span className="bd-metric-label">Ripe</span>
                </div>
                <div className="bd-chip">
                  <span className="bd-chip-value bd-accent-leaf">{ripeness.unripe}</span>
                  <span className="bd-metric-label">Unripe</span>
                </div>
              </div>
              <Bar label="Ripe" pct={ripeness.ripePct} color="danger" />
              <Bar label="Unripe" pct={ripeness.unripePct} color="success" />
            </IonCardContent>
          </IonCard>
        </div>

        <div className="bd-grid bd-grid-split">
          <IonCard className="bd-metric-card">
            <IonCardHeader>
              <IonCardTitle className="bd-card-title">Classification Breakdown</IonCardTitle>
              <IonCardSubtitle>
                YOLO average confidence {metrics.avgConfidence}%
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <Bar label="Healthy" pct={metrics.healthyPct} color="success" />
              <Bar label="Infected" pct={metrics.blightPct} color="danger" />
              <Bar label="Model confidence" pct={metrics.avgConfidence} color="warning" />
            </IonCardContent>
          </IonCard>

          <IonCard className="bd-metric-card">
            <IonList lines="full">
              <IonListHeader>
                <IonLabel>Live Sorting Feed</IonLabel>
              </IonListHeader>
              {events.slice(0, 12).map((e) => (
                <IonItem key={e.id} lines="full">
                  <IonLabel className="ion-text-wrap">
                    <h3 className="bd-accent-gray">
                      #{e.id} — {e.label}
                    </h3>
                    <p>
                      {e.size} · {e.diameterMm}mm · {e.ripeness} · {e.confidence}% · {e.time}
                    </p>
                  </IonLabel>
                  <IonBadge slot="end" color={e.action === "Accepted" ? "success" : "danger"}>
                    {e.action}
                  </IonBadge>
                </IonItem>
              ))}
            </IonList>
          </IonCard>
        </div>
      </div>
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow,
} from "@ionic/react";
import { AppShell } from "@/components/AppShell";
import { useBlightStream, type HardwareState } from "@/lib/useBlightStream";

export const Route = createFileRoute("/system")({
  head: () => ({
    meta: [
      { title: "System Status | BlightDetect+ IoT Hardware Monitor" },
      {
        name: "description",
        content:
          "Live status of the BlightDetect+ hardware: YOLO vision camera, Arduino Uno, conveyor belt, servo sorter, proximity sensors and power supply.",
      },
      { property: "og:title", content: "System Status | BlightDetect+" },
      {
        property: "og:description",
        content: "Monitor every IoT component of the tomato blight sorting line in real time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SystemPage,
});

const STATE_META: Record<HardwareState, { label: string; color: string; hex: string }> = {
  online: { label: "Online / Active", color: "success", hex: "#2e7d32" },
  standby: { label: "Standby", color: "warning", hex: "#f6b93b" },
  offline: { label: "Offline", color: "danger", hex: "#e53935" },
};

function SystemPage() {
  return (
    <ClientOnly fallback={null}>
      <SystemView />
    </ClientOnly>
  );
}

function SystemView() {
  const { hardware } = useBlightStream();
  const online = hardware.filter((h) => h.state === "online").length;

  return (
    <AppShell title="System Status">
      <h2 className="bd-section-title">Hardware Health</h2>
      <p className="bd-metric-label" style={{ margin: "0 8px 8px" }}>
        {online} of {hardware.length} components active
      </p>
      <IonGrid>
        <IonRow>
          {hardware.map((c) => {
            const meta = STATE_META[c.state];
            return (
              <IonCol size="12" sizeMd="6" sizeLg="4" key={c.key}>
                <IonCard className={`bd-status-card ${c.state}`}>
                  <IonCardHeader>
                    <IonCardSubtitle>
                      <span className="bd-dot" style={{ backgroundColor: meta.hex }} />
                      {c.detail}
                    </IonCardSubtitle>
                    <IonCardTitle style={{ fontSize: "1.1rem" }}>{c.name}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonBadge color={meta.color}>{meta.label}</IonBadge>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            );
          })}
        </IonRow>
      </IonGrid>

      <h2 className="bd-section-title">Legend</h2>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "0 8px 24px" }}>
        <IonBadge color="success">Online / Active</IonBadge>
        <IonBadge color="warning">Standby</IonBadge>
        <IonBadge color="danger">Offline</IonBadge>
      </div>
    </AppShell>
  );
}

import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  IonApp,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
  IonNote,
  IonPage,
  IonSplitPane,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "../lib/ionic-setup";

const NAV = [
  { to: "/", label: "Dashboard", note: "Yield monitoring" },
  { to: "/system", label: "System Status", note: "IoT hardware" },
] as const;

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <IonApp>
      <IonSplitPane contentId="bd-main" when="lg">
        <IonMenu contentId="bd-main" type="overlay">
          <IonHeader>
            <IonToolbar color="dark">
              <IonTitle>BlightDetect+</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonListHeader>Navigation</IonListHeader>
              {NAV.map((item) => (
                <IonItem
                  key={item.to}
                  detail={false}
                  button
                  {...(pathname === item.to ? { color: "light" } : {})}
                >
                  <Link to={item.to} style={{ textDecoration: "none", width: "100%" }}>
                    <IonLabel>
                      <h3 className="bd-accent-gray">{item.label}</h3>
                      <IonNote>{item.note}</IonNote>
                    </IonLabel>
                  </Link>
                </IonItem>
              ))}
            </IonList>
            <div className="ion-padding">
              <IonNote>
                AI & IoT based tomato blight detection, classification, sorting and yield
                monitoring system.
              </IonNote>
            </div>
          </IonContent>
        </IonMenu>

        <IonPage id="bd-main">
          <IonHeader>
            <IonToolbar color="dark">
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle>{title}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">{children}</IonContent>
        </IonPage>
      </IonSplitPane>
    </IonApp>
  );
}

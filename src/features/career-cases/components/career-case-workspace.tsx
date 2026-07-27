"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActivityTimeline } from "@/features/career-cases/components/activity-timeline";
import {
  CareerCaseOverviewCards,
  CareerCaseProfileSummary,
} from "@/features/career-cases/components/career-case-overview";
import { EmptyPage } from "@/components/layout/empty-page";
import { CareerSnapshotCard } from "@/features/capabilities/components/career-snapshot-card";
import { CapabilitiesTab } from "@/features/capabilities/components/capabilities-tab";
import { GoalsTab } from "@/features/goals/components/goals-tab";
import { RecommendationsTab } from "@/features/recommendations/components/recommendations-tab";
import { MeetingsTab } from "@/features/meetings/components/meetings-tab";
import {
  CAREER_CASE_WORKSPACE_TABS,
  isCareerCaseWorkspaceTab,
  type CareerCaseWorkspaceTab,
} from "@/features/career-cases/types";
import type { CareerCaseWorkspaceData } from "@/services/career-case.service";
import {
  formatCareerStage,
  formatDate,
} from "@/utils/labels";
import { CareerCaseStatus } from "@/types/domain/career-case";

type CareerCaseWorkspaceProps = {
  data: CareerCaseWorkspaceData;
  initialTab?: string;
};

function formatCaseStatus(status: CareerCaseStatus) {
  switch (status) {
    case CareerCaseStatus.ACTIVE:
      return "Active";
    case CareerCaseStatus.PAUSED:
      return "Paused";
    case CareerCaseStatus.CLOSED:
      return "Closed";
    default:
      return status;
  }
}

export function CareerCaseWorkspace({ data, initialTab }: CareerCaseWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab: CareerCaseWorkspaceTab = isCareerCaseWorkspaceTab(initialTab)
    ? initialTab
    : "overview";

  function handleTabChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "overview") {
      params.delete("tab");
    } else {
      params.set("tab", value);
    }

    const query = params.toString();
    router.replace(
      query ? `/career-cases/${data.careerCase._id}?${query}` : `/career-cases/${data.careerCase._id}`,
      { scroll: false },
    );
  }

  return (
    <div className="space-y-6">
      <CareerCaseProfileSummary
        menteeName={data.mentee.fullName}
        careerStage={formatCareerStage(data.mentee.careerStage)}
        currentRole={data.mentee.currentRole}
        targetRole={data.mentee.targetRole}
        status={formatCaseStatus(data.careerCase.status)}
        createdAt={formatDate(data.careerCase.createdAt)}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {CAREER_CASE_WORKSPACE_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-2">
          <CareerSnapshotCard snapshot={data.snapshot} />
          <CareerCaseOverviewCards counts={data.counts} />

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates across this career case workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityTimeline events={data.activity} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings" className="pt-2">
          <MeetingsTab careerCaseId={data.careerCase._id} />
        </TabsContent>

        <TabsContent value="observations" className="pt-2">
          <EmptyPage
            title="Observations live inside sessions"
            description="Open a mentoring session from the Meetings tab to add and manage observations."
            action={{
              label: "Go to Meetings",
              href: `/career-cases/${data.careerCase._id}?tab=meetings`,
            }}
          />
        </TabsContent>

        <TabsContent value="capabilities" className="pt-2">
          <CapabilitiesTab careerCaseId={data.careerCase._id} />
        </TabsContent>

        <TabsContent value="goals" className="pt-2">
          <GoalsTab careerCaseId={data.careerCase._id} />
        </TabsContent>

        <TabsContent value="recommendations" className="pt-2">
          <RecommendationsTab careerCaseId={data.careerCase._id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

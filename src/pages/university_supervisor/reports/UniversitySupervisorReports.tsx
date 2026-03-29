import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Clock,
  Tag,
  AlertCircle,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { getSupervisorProjects } from "@/services/supervisor";
import {
  getAllReportsForUniSupervisor,
  downloadReport,
} from "@/services/report";
import type { Report } from "@/types/report";
import type { Project } from "@/types/dashboard";

const navData = {
  navMain: [
    { title: "Dashboard",    url: "/uni/dashboard"    },
    { title: "Projects",     url: "/uni/projects"     },
    { title: "Sprints",      url: "/uni/sprints"      },
    { title: "User Stories", url: "/uni/user-stories" },
    { title: "Reports",      url: "/uni/reports"      },
  ],
};

function friendlyName(filePath: string): string {
  const basename = filePath.split("/").pop() ?? filePath;
  return basename.replace(/^\d+_/, "");
}

function Spinner() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="h-6 w-6 rounded-full border-2 border-muted border-t-primary animate-spin" />
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
      {msg}
    </div>
  );
}

function UniReportsContent() {
  const [projects, setProjects]         = useState<Project[]>([]);
  const [selectedId, setSelectedId]     = useState<string | null>(null);
  const [reports, setReports]           = useState<Report[]>([]);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingReports, setLoadingReports]   = useState(false);
  const [error, setError]                     = useState<string | null>(null);
  const [downloadingId, setDownloadingId]     = useState<string | null>(null);

  useEffect(() => {
    setLoadingProjects(true);
    getSupervisorProjects()
      .then((data) => {
        setProjects(data);
        if (data.length > 0) setSelectedId(data[0]._id);
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Impossible de charger les projets")
      )
      .finally(() => setLoadingProjects(false));
  }, []);

  // Fetch reports when project changes
  useEffect(() => {
    if (!selectedId) return;
    setLoadingReports(true);
    setError(null);
    getAllReportsForUniSupervisor(selectedId)
      .then((data) =>
        setReports([...data].sort((a, b) => b.versionLabel - a.versionLabel))
      )
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Impossible de charger les rapports")
      )
      .finally(() => setLoadingReports(false));
  }, [selectedId]);

  const handleDownload = async (report: Report) => {
    setDownloadingId(report._id);
    try {
      const filename =
        friendlyName(report.filePath) || `rapport_v${report.versionLabel}.pdf`;
      await downloadReport(report._id, filename);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erreur lors du téléchargement");
    } finally {
      setDownloadingId(null);
    }
  };

  const selectedProject = projects.find((p) => p._id === selectedId) ?? null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Rapports des étudiants</h2>
        <p className="text-sm text-muted-foreground">
          Consultez et téléchargez les rapports déposés par les étudiants.
        </p>
      </div>

      {/* Project selector */}
      <div>
        <p className="text-sm font-medium mb-3">Sélectionner un projet</p>
        {loadingProjects ? (
          <Spinner />
        ) : projects.length === 0 ? (
          <Empty msg="Aucun projet supervisé pour l'instant." />
        ) : (
          <div className="flex flex-wrap gap-2">
            {projects.map((p) => (
              <button
                key={p._id}
                onClick={() => setSelectedId(p._id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  selectedId === p._id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary"
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reports list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">
            Historique des versions
            {selectedProject ? ` — ${selectedProject.title}` : ""}
          </h3>
          {!loadingReports && reports.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {reports.length} version(s)
            </span>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </div>
        )}

        {!selectedId ? (
          <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
            <FolderOpen className="size-8 text-muted-foreground/40" />
            Sélectionnez un projet pour voir ses rapports.
          </div>
        ) : loadingReports ? (
          <Spinner />
        ) : reports.length === 0 ? (
          <Empty msg="Aucun rapport déposé pour ce projet." />
        ) : (
          <div className="space-y-3">
            {reports.map((rep, idx) => (
              <div
                key={rep._id}
                className="rounded-xl border bg-card p-4 flex items-start gap-4"
              >
                {/* Icon */}
                <div className="rounded-lg bg-muted p-2.5 shrink-0">
                  <FileText className="size-5 text-muted-foreground" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-sm truncate">
                      {friendlyName(rep.filePath)}
                    </span>
                    {idx === 0 && (
                      <span className="inline-flex items-center rounded-full border bg-blue-50 border-blue-200 text-blue-700 px-2 py-0.5 text-xs font-medium whitespace-nowrap">
                        Dernière version
                      </span>
                    )}
                  </div>

                  {/* Notes — read-only */}
                  {rep.notes && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {rep.notes}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Tag className="size-3" />
                      v{rep.versionLabel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {new Date(rep.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Download only — supervisors cannot edit/delete */}
                <div className="shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(rep)}
                    disabled={downloadingId === rep._id}
                    title="Télécharger"
                  >
                    {downloadingId === rep._id ? (
                      <Loader2 className="size-3 mr-1 animate-spin" />
                    ) : (
                      <Download className="size-3 mr-1" />
                    )}
                    Télécharger
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function UniversitySupervisorReports() {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") ?? "{}");
    } catch {
      return {};
    }
  })();

  return (
    <SidebarProvider>
      <AppSidebar
        data={navData}
        userInfo={{
          name: user.name ?? "Uni Supervisor",
          role: user.role ?? "UniSupervisor",
        }}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/uni/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Rapports</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 max-w-4xl">
          <UniReportsContent />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
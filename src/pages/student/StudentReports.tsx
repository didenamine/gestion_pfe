import { mockReportVersions } from "@/data/mockdata";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Upload,
  Download,
  Clock,
  Tag,
  HardDrive,
} from "lucide-react";

export default function StudentReports() {
  const sorted = [...mockReportVersions].sort(
    (a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Rapports</h2>
          <p className="text-sm text-muted-foreground">
            {mockReportVersions.length} version(s) déposée(s)
          </p>
        </div>
        <Button size="sm">
          <Upload className="size-4 mr-1" />
          Déposer une version
        </Button>
      </div>

      {/* Upload card */}
      <div className="rounded-xl border-2 border-dashed border-muted p-8 text-center hover:border-muted-foreground/30 transition-colors cursor-pointer">
        <Upload className="size-8 text-muted-foreground/50 mx-auto mb-3" />
        <p className="text-sm font-medium">Glisser-déposer un PDF ici</p>
        <p className="text-xs text-muted-foreground mt-1">
          ou cliquez pour sélectionner un fichier
        </p>
        <Button variant="outline" size="sm" className="mt-4">
          Choisir un fichier
        </Button>
      </div>

      {/* Versions list */}
      <div>
        <h3 className="text-sm font-medium mb-3">Historique des versions</h3>
        <div className="space-y-3">
          {sorted.map((rep, idx) => (
            <div
              key={rep.id}
              className="rounded-xl border bg-card p-4 flex items-start gap-4"
            >
              <div className="rounded-lg bg-muted p-2.5 shrink-0">
                <FileText className="size-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-medium text-sm">{rep.fileName}</span>
                  {idx === 0 && (
                    <span className="inline-flex items-center rounded-full border bg-blue-50 border-blue-200 text-blue-700 px-2 py-0.5 text-xs font-medium">
                      Dernière version
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {rep.notes}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <Tag className="size-3" />
                    {rep.version}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {new Date(rep.uploadedAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  <span className="flex items-center gap-1">
                    <HardDrive className="size-3" />
                    {rep.fileSize}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                <Download className="size-3 mr-1" />
                Télécharger
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

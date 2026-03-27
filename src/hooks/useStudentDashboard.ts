import { useEffect, useState } from "react";
import {
  fetchProjectProgress,
  fetchStandbyTasks,
  fetchLatestMeetings,
  type ProjectProgress,
  type StandbyTask,
  type Meeting,
} from "../services/dashboard.ts";

interface DashboardData {
  progress: ProjectProgress | null;
  standbyTasks: StandbyTask[];
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
}

export function useStudentDashboard(projectId: string | null): DashboardData {
  const [progress, setProgress] = useState<ProjectProgress | null>(null);
  const [standbyTasks, setStandbyTasks] = useState<StandbyTask[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(!!projectId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      setProgress(null);
      setStandbyTasks([]);
      setMeetings([]);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prog, tasks] = await Promise.all([
          fetchProjectProgress(projectId),
          fetchStandbyTasks(),
          //fetchLatestMeetings(projectId),
        ]);
        if (!cancelled) {
          setProgress(prog);
          setStandbyTasks(tasks);
          //setMeetings(mtgs);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erreur inconnue");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return { progress, standbyTasks, meetings, loading, error };
}

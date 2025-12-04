import { useCallback, useEffect, useState } from "react";
import { useConnContext } from "@context";
import { Run, RunResponse } from "../types/types";

export function useRuns() {
  const [runs, setRuns] = useState<Run[]>([]);
  const { fetchData } = useConnContext();

  const getRuns = async (): Promise<RunResponse[]> => {
    const runsArray = await fetchData<RunResponse[]>('/tracks/', 'GET');
    console.log('response', runsArray);
    if (runsArray?.success === false) {
      console.error('Error getting runs from server', runsArray.error);
      return [];
    } else {
      return runsArray?.data ? runsArray.data : [];
    }
  }

  useEffect(() => {
    getRuns()
      .then(runs => setRuns(
        runs.map((run: RunResponse) => {
          console.log('nº runs', runs.length);
          let seconds = (new Date(run.updatedAt).getTime() - new Date(run.createdAt).getTime()) / 1000;
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);
          const remainingSeconds = Math.floor(seconds % 60);
          const pad = (num: number) => String(num).padStart(2, '0');
          const minPac = (hours * 60) + minutes;
          const pace = String(Math.floor(Number(run.distance) / minPac));

          return {
            id: run.trackId,
            date: new Date(run.createdAt).toDateString(),
            time: `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`,
            pace,
            distance: run.distance,
            profile: run.altitudes
          };
        }).sort((a: Run, b: Run) => Number(a.id) - Number(b.id))
      ));
    console.log('final runs', runs);
  }, []);

  const deleteRun = useCallback(async (runId: string) => {
    const response = await fetchData(`/tracks/${runId}`, 'DELETE', null);
    if (response?.success) {
      setRuns(prevRuns => prevRuns.filter(run => run.id !== runId));
      return true;
    } else return false;
  }, [fetchData]);

  return { runs, refreshRuns: getRuns, deleteRun };
}
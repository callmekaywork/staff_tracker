'use client';

import { Label } from '@/components/ui/label';
import { orpc } from '@/orpc/client';
import { DailyTaskTrackerType } from '@/types/next-auth';
import React, { useEffect, useState } from 'react';

export default function Task_report() {
  // Group by user and date
  const [isTasks, setIsTasks] = useState<DailyTaskTrackerType[]>([]);

  useEffect(() => {
    async function GetAllTodayTasks() {
      const res = await orpc.tasks.groupedtask();

      setIsTasks(
        res.map((task) => ({ ...task, task_day: task.task_day as string }))
      );
      //   console.log(res);
    }

    GetAllTodayTasks();
  }, []);

  return (
    <div className="w-full mt-7">
      <div className="flex flex-col gap-2 border-2 p-2 ">
        <Label className="text-4xl">Old Tasks Reports</Label>
        <div>
          {isTasks.map((ind, idx) => (
            <div key={idx}>
              {ind.email} {ind.task_day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

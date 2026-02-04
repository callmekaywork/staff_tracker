'use client';

import { Label } from '@/components/ui/label';
import { orpc } from '@/orpc/client';
import { DailyTaskTrackerType } from '@/types/next-auth';
import React, { useEffect, useState } from 'react';

export default function Task_report() {
  // Group by user and date
  const [isTasks, setIsTasks] = useState<DailyTaskTrackerType[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate indexes
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = isTasks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(isTasks.length / itemsPerPage);

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

  function FormatDate(time: string) {
    return new Date(time).toDateString().split('T')[0];
  }

  return (
    <div className="w-full mt-7">
      <div className="flex flex-col gap-2 border-2 p-2 ">
        <Label className="text-4xl">Old Tasks Reports</Label>
        <div>
          {/* {isTasks.map((ind, idx) => (
            <div key={idx} className="flex flex-row gap-5">
              <div>{ind.email}</div>
              {FormatDate(ind.task_day!)}
            </div>
          ))} */}

          <div className="space-y-4 md:hidden">
            {isTasks.map((ind, idx) => (
              <div key={idx} className="border p-3 rounded shadow-sm">
                <p>
                  <span className="font-semibold">Email:</span> {ind.email}
                </p>
                <p>
                  <span className="font-semibold">Task Title:</span>{' '}
                  {ind.task_title}
                </p>
                <p>
                  <span className="font-semibold">Task Status:</span>
                  {ind.task_status === 'not_started'
                    ? 'Not Started'
                    : ind.task_status === 'in_progress'
                      ? 'In Progress'
                      : 'Done'}
                </p>
                <p>
                  <span className="font-semibold">Task Started:</span>{' '}
                  {ind.task_started?.toDateString()}
                </p>
                <p>
                  <span className="font-semibold">Task Priority:</span>{' '}
                  {ind.task_priority}
                </p>
                <p>
                  <span className="font-semibold">Task Day:</span>{' '}
                  {FormatDate(ind.task_day!)}
                </p>
              </div>
            ))}
          </div>

          {/* Keep the table for larger screens */}
          <div className="hidden md:block overflow-x-auto">
            {/* your table code here */}
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 ">
                  <th className="border border-gray-300 px-2 py-2 text-left">
                    Email
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-left">
                    Task Title
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-left">
                    Task Status
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-left">
                    Task Started
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-left">
                    Task Priority
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-left">
                    Task Day
                  </th>
                </tr>
              </thead>
              <tbody>
                {isTasks.map((ind, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="border border-gray-300 px-2 py-2">
                      {ind.email}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {ind.task_title}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {ind.task_status == 'not_started'
                        ? 'Not Started'
                        : ind.task_status == 'in_progress'
                          ? 'In Progress'
                          : 'Done'}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {ind.task_started?.toDateString()}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {ind.task_priority}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {FormatDate(ind.task_day!)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination controls */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? 'bg-gray-200' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

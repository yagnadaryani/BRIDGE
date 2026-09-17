'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockStore } from '@/lib/firebase/mockStore';

export default function StudentRosterPage() {
  const aaravModel = mockStore.getLearnerModel('aarav-101');

  const studentsList = [
    { id: 'aarav-101', name: 'Aarav Sharma', department: 'CSE', mastery: aaravModel.overallMastery, gap: 'Boundary Indexing', status: 'NEEDS_ATTENTION' },
    { id: 'student-102', name: 'Priya Patel', department: 'CSE', mastery: 85, gap: 'None', status: 'ON_TRACK' },
    { id: 'student-103', name: 'Rohan Mehta', department: 'CSE', mastery: 78, gap: 'None', status: 'ON_TRACK' },
    { id: 'student-104', name: 'Ananya Gupta', department: 'CSE', mastery: 92, gap: 'None', status: 'EXCELLING' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-bold text-slate-100">Class Student Roster</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">CSE 3rd Year • 48 Enrolled Students</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="p-3">Student Name</th>
                <th className="p-3">Department</th>
                <th className="p-3">Overall Mastery</th>
                <th className="p-3">Active Gap</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {studentsList.map((st) => (
                <tr key={st.id} className="hover:bg-slate-900/60">
                  <td className="p-3 font-semibold">{st.name}</td>
                  <td className="p-3 text-slate-400">{st.department}</td>
                  <td className="p-3 font-mono font-bold text-indigo-400">{st.mastery}%</td>
                  <td className="p-3 text-amber-300">{st.gap}</td>
                  <td className="p-3">
                    <Badge variant={st.status === 'NEEDS_ATTENTION' ? 'warning' : 'success'}>
                      {st.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Link href={`/teacher/students/${st.id}`}>
                      <Button size="sm" variant="ghost" className="text-xs text-purple-400">
                        Inspect <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

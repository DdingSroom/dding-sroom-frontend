'use client';

import React from 'react';

export default function ReservationDetailPage() {
  const reservations = [
    {
      id: 1,
      room: '스터디룸 01',
      time: '15:00 ~ 17:00',
      user: 'USER 01',
      createdAt: '2024-08-31 14:51',
    },
    {
      id: 2,
      room: '스터디룸 02',
      time: '17:00 ~ 19:00',
      user: 'USER 02',
      createdAt: '2024-08-31 14:30',
    },
    {
      id: 3,
      room: '스터디룸 04',
      time: '01:00 ~ 03:00',
      user: 'USER 03',
      createdAt: '2024-08-31 14:02',
    },
  ];

  return (
    <div className="bg-[#F1F2F4] p-6 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-lg font-semibold mb-4">예약 현황</h1>

        <table className="w-full text-sm text-left">
          <thead className="bg-[#F7F7F7] border-b text-[#333]">
            <tr>
              <th className="py-3 px-2 w-8">#</th>
              <th className="py-3 px-2">스터디룸</th>
              <th className="py-3 px-2">예약 시간</th>
              <th className="py-3 px-2">사용자</th>
              <th className="py-3 px-2">예약일</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {reservations.map((item, index) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-2">{index + 1}</td>
                <td className="py-3 px-2">{item.room}</td>
                <td className="py-3 px-2 text-[#788DFF]">{item.time}</td>
                <td className="py-3 px-2">{item.user}</td>
                <td className="py-3 px-2 text-xs text-gray-500">
                  {item.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

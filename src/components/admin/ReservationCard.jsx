'use client';

import React from 'react';

export default function ReservationCard({
  roomName,
  time,
  userName,
  timestamp,
}) {
  return (
    <div className="flex items-start gap-3 border border-gray-200 rounded p-2">
      <img
        src="/static/icons/studyroom_image.png"
        className="w-16 h-16 object-cover rounded"
        alt="스터디룸"
      />
      <div className="flex flex-col justify-center text-sm">
        <p className="font-semibold">{roomName}</p>
        <p className="text-[#788DFF]">{time}</p>
        <p className="text-gray-600">{userName}</p>
        <p className="text-xs text-gray-400">{timestamp}</p>
      </div>
    </div>
  );
}

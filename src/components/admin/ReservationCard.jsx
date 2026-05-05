'use client';

import React from 'react';

export default function ReservationCard({
  roomName,
  time,
  userName,
  timestamp,
}) {
  return (
    <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors bg-white shadow-sm">
      <img
        src="/static/icons/studyroom_image.png"
        className="w-12 h-12 object-cover rounded-lg"
        alt="스터디룸"
      />
      <div className="flex flex-col gap-1 text-sm min-w-0">
        <p className="font-semibold text-content truncate">{roomName}</p>
        <p className="text-primary font-medium">{time}</p>
        <p className="text-content-secondary text-xs truncate">{userName}</p>
        <p className="text-content-muted text-xs">{timestamp}</p>
      </div>
    </div>
  );
}

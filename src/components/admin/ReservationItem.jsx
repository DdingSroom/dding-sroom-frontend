'use client';

import React from 'react';

export default function ReservationItem({ room, time }) {
  return (
    <div className="flex items-center gap-3 border border-gray-200 rounded p-2 mb-2">
      <img
        src="/static/icons/studyroom_image.png"
        alt="스터디룸 이미지"
        className="w-12 h-12 object-cover rounded"
      />
      <div>
        <p className="font-medium">{room}</p>
        <p className="text-[#788DFF] text-sm">{time}</p>
      </div>
    </div>
  );
}

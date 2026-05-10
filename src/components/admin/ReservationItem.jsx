'use client';

import React from 'react';

import { STUDYROOM_IMAGE_SRC } from '@constants/images';

export default function ReservationItem({ room, time }) {
  return (
    <div className="flex items-center gap-3 border border-gray-200 rounded p-2 mb-2">
      <img
        src={STUDYROOM_IMAGE_SRC}
        alt="스터디룸 이미지"
        className="w-12 h-12 object-cover rounded"
      />
      <div>
        <p className="font-medium">{room}</p>
        <p className="text-brand text-sm">{time}</p>
      </div>
    </div>
  );
}

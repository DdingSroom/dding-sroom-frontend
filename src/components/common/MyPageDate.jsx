const MyPageDate = ({ date }) => {
  return (
    <div className="flex items-center justify-start px-6 py-4 bg-gradient-to-r from-[#788DFF]/10 to-[#A8B8FF]/10 mt-6 rounded-lg border-l-4 border-[#788DFF]">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-[#788DFF] rounded-full"></div>
        <p className="text-xl font-semibold text-[#37352f] tracking-wide">{date}</p>
      </div>
    </div>
  );
};

export default MyPageDate;

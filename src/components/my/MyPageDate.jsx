const MyPageDate = ({ date }) => {
  return (
    <div className="flex items-center justify-start px-6 py-4 bg-gradient-to-r from-brand/10 to-brand-light/10 mt-6 rounded-lg border-l-4 border-brand">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-brand rounded-full"></div>
        <p className="text-xl font-semibold text-content tracking-wide">
          {date}
        </p>
      </div>
    </div>
  );
};

export default MyPageDate;

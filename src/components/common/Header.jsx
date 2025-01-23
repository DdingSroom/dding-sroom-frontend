const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 pt-12">
      <img src="/static/icons/logo.svg" alt="logo" className="h-10" />
      <div className="flex items-center space-x-4">
        <img src="/static/icons/bell_icon.png" alt="bell" className="h-6" />
        <div className="bg-[#788DFF] rounded-full w-full h-full flex items-center justify-center overflow-hidden">
          <img
            src="/static/icons/person_icon.png"
            alt="person_icon"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;

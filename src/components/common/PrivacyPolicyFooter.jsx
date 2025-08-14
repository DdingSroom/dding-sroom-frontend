import Link from 'next/link';

const PrivacyPolicyFooter = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-100">
      <div className="px-6 py-8">
        <div className="text-left space-y-3">
          <p className="text-sm font-semibold text-[#37352f]">
            <Link
              href="/privacy-policy"
              className="hover:text-[#788cff] transition-colors"
            >
              개인정보 처리방침
            </Link>
          </p>
          <p className="text-xs text-[#73726e] leading-relaxed">
            Copyright © DdingsRoom. All Rights Reserved
          </p>
          <p className="text-xs text-[#73726e] leading-relaxed">
            E-mail: ddingsroom2025@mju.ac.kr
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PrivacyPolicyFooter;

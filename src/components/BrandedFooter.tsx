
import { useBranding } from '@/contexts/BrandingContext';

const BrandedFooter = () => {
  const { brandConfig } = useBranding();

  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center text-sm text-gray-600">
          {brandConfig.footer_text}
        </div>
      </div>
    </footer>
  );
};

export default BrandedFooter;

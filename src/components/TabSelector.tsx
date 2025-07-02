import { Tab } from "@/types/types";

interface TabSelectorProps {
  tabs: Tab[];
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isFocusModeActive: boolean;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  tabs,
  activeTab,
  onSelectTab,
  isFocusModeActive,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            disabled={isFocusModeActive}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
              ${isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'}
              ${isFocusModeActive ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

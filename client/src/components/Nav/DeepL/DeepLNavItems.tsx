import { type FC } from 'react';
import type { TConversation } from 'librechat-data-provider';
import { useLocalize } from '~/hooks';

const DeepLNavItems: FC<{ conversation: TConversation }> = ({ conversation }) => {
  const localize = useLocalize();

  const handleGoToDeepL = () => {
    // Logic to navigate to the DeepL Document Translator page
    window.location.href = '/deepl-translator';
  };

  return (
    <div className="flex flex-col">
      <button
        className="mt-1 flex h-10 w-full items-center gap-2 rounded-lg p-2 text-sm transition-colors duration-200 hover:bg-surface-active-alt"
        onClick={handleGoToDeepL}
      >
        {localize('com_ui_go_to_deepl')}
      </button>
    </div>
  );
};

export default DeepLNavItems;
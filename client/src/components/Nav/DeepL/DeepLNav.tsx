import { type FC } from 'react';
import { useRecoilValue } from 'recoil';
import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import { DocumentIcon } from '@radix-ui/react-icons';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';
import store from '~/store';

type DeepLNavProps = {
  isSmallScreen: boolean;
};

const DeepLNav: FC<DeepLNavProps> = ({ isSmallScreen }: DeepLNavProps) => {
  const localize = useLocalize();
  const conversation = useRecoilValue(store.conversationByIndex(0));

  return (
    <Menu as="div" className="group relative">
      {({ open }) => (
        <>
          <MenuButton
            className={cn(
              'mt-text-sm flex h-10 w-full items-center gap-2 rounded-lg p-2 text-sm transition-colors duration-200 hover:bg-surface-active-alt',
              open ? 'bg-surface-active-alt' : '',
              isSmallScreen ? 'h-12' : '',
            )}
            data-testid="deepl-menu"
          >
            <div className="h-7 w-7 flex-shrink-0">
              <div className="relative flex h-full items-center justify-center rounded-full border border-border-medium bg-surface-primary-alt text-text-primary">
                <DocumentIcon className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
            <div className="grow overflow-hidden whitespace-nowrap text-left text-sm font-medium text-text-primary">
              {localize('com_ui_deepl_translator')}
            </div>
          </MenuButton>
          <MenuItems className="absolute left-0 top-full z-[100] mt-1 w-full translate-y-0 overflow-hidden rounded-lg bg-surface-active-alt p-1.5 shadow-lg outline-none">
            {conversation && (
              <DeepLNavItems conversation={conversation} />
            )}
          </MenuItems>
        </>
      )}
    </Menu>
  );
};

export default DeepLNav;
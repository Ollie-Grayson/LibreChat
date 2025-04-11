import React, { useEffect } from 'react';
import { useGetStartupConfig } from '~/data-provider';

export default function Footer({ className }: { className?: string }) {
  const { data: config } = useGetStartupConfig();
  
  // Get DeepL link directly from config
  const deepLLink = config?.interface?.deepLDocumentTranslatorPage;

  // Ensure deepLLink is available, otherwise render nothing or some default message
  const deepLLinkRender = deepLLink?.externalUrl && (
    <a
      className="text-text-secondary underline"
      href={deepLLink.externalUrl}
      target={deepLLink.openNewTab === true ? '_blank' : undefined}
      rel="noreferrer"
    >
      DeepL Document Translator
    </a>
  );

  // Only render DeepL link, no fallback to LibreChat or other links
  return (
    <div
      className={className ?? 'relative flex items-center justify-center gap-2 px-2 py-2 text-center text-xs text-text-primary md:px-[60px]'}
      role="contentinfo"
    >
      {/* Render DeepL link if it exists */}
      {deepLLinkRender || <p>No footer content available</p>}
    </div>
  );
}

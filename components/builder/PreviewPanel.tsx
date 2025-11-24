'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewPanelProps {
  htmlContent: string;
  cssContent: string;
  onElementSelect: (elementInfo: string) => void;
}

export default function PreviewPanel({
  htmlContent,
  cssContent,
  onElementSelect,
}: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    updatePreview();
  }, [htmlContent, cssContent]);

  const updatePreview = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .preview-highlight {
            outline: 2px dashed #3b82f6 !important;
            outline-offset: 2px;
            cursor: pointer;
            transition: outline 0.2s;
          }
          .preview-highlight:hover {
            outline-color: #2563eb !important;
            outline-width: 3px !important;
          }
          ${cssContent}
        </style>
      </head>
      <body>
        ${htmlContent}
        <script>
          document.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const target = e.target;
            if (!target) return;

            const tagName = target.tagName.toLowerCase();
            const classList = Array.from(target.classList).join(', ');
            const textContent = target.textContent?.substring(0, 50) || '';

            let elementInfo = tagName;
            if (classList) elementInfo += ' with classes: ' + classList;
            if (textContent) elementInfo += ' containing: "' + textContent + '..."';

            window.parent.postMessage({
              type: 'elementClick',
              elementInfo: elementInfo,
              tagName: tagName,
              classList: classList,
              textContent: textContent
            }, '*');

            document.querySelectorAll('.preview-highlight').forEach(el => {
              el.classList.remove('preview-highlight');
            });

            target.classList.add('preview-highlight');
          });

          document.addEventListener('mouseover', function(e) {
            if (e.target) {
              e.target.style.outline = '1px dashed #93c5fd';
              e.target.style.outlineOffset = '2px';
            }
          });

          document.addEventListener('mouseout', function(e) {
            if (e.target && !e.target.classList.contains('preview-highlight')) {
              e.target.style.outline = '';
            }
          });
        </script>
      </body>
      </html>
    `;

    iframeDoc.open();
    iframeDoc.write(fullHtml);
    iframeDoc.close();
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'elementClick') {
        onElementSelect(event.data.elementInfo);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onElementSelect]);

  const getIframeWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      default:
        return '100%';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="border-b border-gray-200 p-3 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Live Preview</h2>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('desktop')}
              className="h-8 px-3"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('tablet')}
              className="h-8 px-3"
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('mobile')}
              className="h-8 px-3"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 flex justify-center items-start">
        <div
          className="bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300"
          style={{
            width: getIframeWidth(),
            height: viewMode === 'desktop' ? '100%' : '667px',
            maxWidth: '100%',
          }}
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Website Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white px-4 py-2">
        <p className="text-xs text-gray-500 text-center">
          Click any element in the preview to edit it
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import ChatPanel from '@/components/builder/ChatPanel';
import PreviewPanel from '@/components/builder/PreviewPanel';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function BuilderPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState('');
  console.log('htmlContent :', htmlContent);
  const [cssContent, setCssContent] = useState('');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeProject();
  }, []);

  const initializeProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: 'New Website',
          html_content: '<div class="container"><h1>Welcome to Your Website Builder</h1><p>Start chatting to build your website!</p></div>',
          css_content: '.container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: system-ui, -apple-system, sans-serif; } h1 { color: #1a1a1a; font-size: 2.5rem; margin-bottom: 1rem; } p { color: #666; font-size: 1.1rem; line-height: 1.6; }',
        })
        .select()
        .single();

      if (error) throw error;

      setProjectId(data.id);
      setHtmlContent(data.html_content);
      setCssContent(data.css_content);
    } catch (error) {
      console.error('Error initializing project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentUpdate = (html: string, css: string) => {
    setHtmlContent(html);
    setCssContent(css);

    if (projectId) {
      supabase
        .from('projects')
        .update({
          html_content: html,
          css_content: css,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId)
        .then(({ error }) => {
          if (error) console.error('Error updating project:', error);
        });
    }
  };

  const handleElementSelect = (elementInfo: string) => {
    setSelectedElement(elementInfo);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/2 border-r border-gray-200 bg-white">
        <PreviewPanel
          htmlContent={htmlContent}
          cssContent={cssContent}
          onElementSelect={handleElementSelect}
        />
      </div>
      <div className="w-1/2 bg-white">
        <ChatPanel
          projectId={projectId}
          selectedElement={selectedElement}
          onContentUpdate={handleContentUpdate}
          currentHtml={htmlContent}
          currentCss={cssContent}
        />
      </div>
    </div>
  );
}

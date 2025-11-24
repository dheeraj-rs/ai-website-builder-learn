'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase, ChatMessage } from '@/lib/supabase';
import { Send, Download, Loader2, Sparkles } from 'lucide-react';

interface ChatPanelProps {
  projectId: string | null;
  selectedElement: string | null;
  onContentUpdate: (html: string, css: string) => void;
  currentHtml: string;
  currentCss: string;
}

export default function ChatPanel({
  projectId,
  selectedElement,
  onContentUpdate,
  currentHtml,
  currentCss,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projectId) {
      loadChatHistory();
    }
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (selectedElement) {
      const suggestion = `I see you've selected: ${selectedElement}. I can help you:\n- Change the text content\n- Modify colors and styling\n- Add animations\n- Adjust layout and spacing\n\nWhat would you like to change?`;

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        project_id: projectId || '',
        role: 'assistant',
        content: suggestion,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (projectId) {
        supabase.from('chat_messages').insert({
          project_id: projectId,
          role: 'assistant',
          content: suggestion,
        });
      }
    }
  }, [selectedElement]);

  const loadChatHistory = async () => {
    if (!projectId) return;

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading chat history:', error);
      return;
    }

    setMessages(data || []);
  };

  const handleSend = async () => {
    if (!input.trim() || !projectId) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      project_id: projectId,
      role: 'user',
      content: input,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    await supabase.from('chat_messages').insert({
      project_id: projectId,
      role: 'user',
      content: input,
    });

    try {
      const systemPrompt = `You are an expert web developer helping build a website.
Current HTML:
${currentHtml}

Current CSS:
${currentCss}

User request: ${input}

${selectedElement ? `The user has selected this element: ${selectedElement}` : ''}

Please generate updated HTML and CSS code to fulfill the user's request.
Return your response in this exact format:

HTML:
[html code here]

CSS:
[css code here]

EXPLANATION:
[brief explanation of changes]

Make the website beautiful, modern, and production-ready with proper styling.`;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: systemPrompt,
          context: messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n'),
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        project_id: projectId,
        role: 'assistant',
        content: data.text,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      await supabase.from('chat_messages').insert({
        project_id: projectId,
        role: 'assistant',
        content: data.text,
      });

      const htmlMatch = data.text.match(/HTML:\s*([\s\S]*?)(?=CSS:|EXPLANATION:|$)/i);
      const cssMatch = data.text.match(/CSS:\s*([\s\S]*?)(?=EXPLANATION:|$)/i);

      if (htmlMatch && cssMatch) {
        const newHtml = htmlMatch[1].trim().replace(/```html|```/g, '').trim();
        const newCss = cssMatch[1].trim().replace(/```css|```/g, '').trim();
        onContentUpdate(newHtml, newCss);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        project_id: projectId,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <style>
${currentCss}
    </style>
</head>
<body>
${currentHtml}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white" />
            <h2 className="text-lg font-semibold text-white">AI Website Builder</h2>
          </div>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Start Building Your Website
            </h3>
            <p className="text-gray-600 mb-6">
              Tell me what you want to create, or click on any element in the preview to edit it.
            </p>
            <div className="grid gap-2 max-w-md mx-auto">
              <Button
                variant="outline"
                className="justify-start text-left"
                onClick={() => setInput('Create a modern landing page for a tech startup')}
              >
                Create a modern landing page
              </Button>
              <Button
                variant="outline"
                className="justify-start text-left"
                onClick={() => setInput('Add a hero section with a call-to-action button')}
              >
                Add a hero section
              </Button>
              <Button
                variant="outline"
                className="justify-start text-left"
                onClick={() => setInput('Create a contact form with name, email, and message fields')}
              >
                Create a contact form
              </Button>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </div>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Generating...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe what you want to build or edit..."
            className="flex-1 min-h-[60px] max-h-[120px] resize-none"
            disabled={isGenerating}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

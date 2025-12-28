export type Chapter = {
  id: string;
  title: string;
  content: string;
};

export type Template = {
  id: string;
  name: string;
  description: string;
};

export type TemplateType = 'novel' | 'memoir' | 'poetry';

export type WritingFont = 'literata' | 'merriweather' | 'lora' | 'inter' | 'roboto';

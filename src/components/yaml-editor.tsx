'use client'; // controlled textarea with onChange state

interface YamlEditorProps {
  value: string;
  onChange: (v: string) => void;
  error: string | null;
}

export function YamlEditor({ value, onChange, error }: YamlEditorProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-200 bg-white px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">YAML</span>
      </div>
      <textarea
        className="flex-1 resize-none bg-zinc-50 p-4 font-mono text-sm text-zinc-900 outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
      />
      {error && (
        <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-xs text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

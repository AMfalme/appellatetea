import { cn } from '@/lib/utils/cn';
import {
  FILE_DROP,
  FILE_DROP_HINT,
  FILE_DROP_LABEL,
  FILE_DROP_TITLE,
} from './formTokens';

export interface FileDropZoneProps {
  id: string;
  onFileSelect: (file: File) => void;
  label: string;
  hint?: string;
  accept?: string;
  /** Exposes the hidden input so callers can reset its value. */
  inputRef?: React.Ref<HTMLInputElement>;
  /** Rendered inside the drop region, above the call to action. */
  preview?: React.ReactNode;
  /** Extra content below the label, e.g. a "Clear" button. */
  accessory?: React.ReactNode;
  className?: string;
}

/**
 * Dashed media drop region.
 *
 * Uploads are handled by the parent (Cloudinary); this component only provides
 * the surface, the hidden file input and the focus/hover affordances.
 */
export function FileDropZone({
  id,
  onFileSelect,
  label,
  hint,
  accept = 'image/*',
  inputRef,
  preview,
  accessory,
  className,
}: FileDropZoneProps) {
  return (
    <div className={cn(FILE_DROP, className)}>
      <label htmlFor={id} className={FILE_DROP_LABEL}>
        {preview && <div className="mb-4">{preview}</div>}

        <FileIcon />

        <span className={FILE_DROP_TITLE}>{label}</span>

        {hint && <span className={FILE_DROP_HINT}>{hint}</span>}
      </label>

      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFileSelect(file);
        }}
        className="sr-only"
      />

      {accessory && <div className="mt-4 flex justify-center">{accessory}</div>}
    </div>
  );
}

function FileIcon() {
  return (
    <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-600">
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 011.1 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
    </span>
  );
}

import { UploadCloud, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { pluralize } from "../../utils/formatters";


export function FileDropzone({ files, onFilesChange, multiple = true, label = "Drop files here" }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple,
    accept: {
      "image/*": []
    },
    onDrop: (acceptedFiles) => {
      if (!acceptedFiles.length) {
        return;
      }
      onFilesChange(multiple ? [...files, ...acceptedFiles] : acceptedFiles.slice(0, 1));
    }
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-[24px] border border-dashed p-8 text-center transition ${
          isDragActive
            ? "border-[var(--c-accent)] bg-[var(--c-accent-soft)]"
            : "border-stone-300 bg-stone-50/70 hover:border-stone-400 hover:bg-white"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto mb-4 h-10 w-10 text-[var(--c-accent)]" />
        <p className="text-base font-semibold">{label}</p>
        <p className="mt-2 text-sm text-stone-600">
          Drag wedding images or browse from your device. JPG, PNG, and HEIC can be supported in the backend pipeline.
        </p>
      </div>

      {files.length ? (
        <div className="rounded-[24px] border border-stone-200 bg-white/80 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-stone-800">{pluralize(files.length, "file")} selected</p>
            <button type="button" className="button-secondary px-4 py-2 text-xs" onClick={() => onFilesChange([])}>
              Clear all
            </button>
          </div>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-stone-800">{file.name}</p>
                  <p className="text-xs text-stone-500">{Math.round(file.size / 1024)} KB</p>
                </div>
                <button
                  type="button"
                  className="rounded-full p-2 text-stone-500 transition hover:bg-stone-200 hover:text-stone-800"
                  onClick={() => onFilesChange(files.filter((_, fileIndex) => fileIndex !== index))}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}


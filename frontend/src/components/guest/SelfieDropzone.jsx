import { Camera, ImagePlus } from "lucide-react";
import { useDropzone } from "react-dropzone";

function SelfieDropzone({
  onFileSelected,
  onFilesSelected,
  multiple = false,
  title = "Upload a selfie or take a live photo",
  description = "Drag and drop, tap to browse, or use your phone camera. Clear, front-facing selfies produce better AI matches.",
  helperText = "JPG, PNG, WEBP - 1 image only",
  capture = true
}) {
  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"]
    },
    maxFiles: multiple ? 0 : 1,
    multiple,
    onDrop: (acceptedFiles) => {
      if (multiple) {
        onFilesSelected?.(acceptedFiles);
        return;
      }

      if (acceptedFiles[0]) {
        onFileSelected?.(acceptedFiles[0]);
      }
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`rounded-[30px] border border-dashed p-6 text-center transition sm:p-8 ${
        isDragActive
          ? "border-[var(--primary)] bg-[rgba(140,79,65,0.08)]"
          : "border-[rgba(117,82,65,0.18)] bg-[rgba(255,250,246,0.82)]"
      }`}
    >
      <input {...getInputProps()} capture={capture ? "user" : undefined} />
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[rgba(140,79,65,0.1)] text-[var(--primary)]">
        {isDragActive ? <Camera size={26} /> : <ImagePlus size={26} />}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-[var(--text)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">
        {helperText}
      </p>
    </div>
  );
}

export default SelfieDropzone;

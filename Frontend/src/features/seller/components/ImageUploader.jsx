// import { useRef } from "react";

// export default function ImageUploader({ images, setImages }) {
//   const inputRef = useRef(null);

//   const handleFiles = (files) => {
//     const newFiles = Array.from(files).map((file) => ({
//       file,
//       preview: URL.createObjectURL(file),
//     }));
//     setImages((prev) => [...prev, ...newFiles]);
//   };

//   const removeImage = (e, index) => {
//     e.stopPropagation();
//     setImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   const moveImage = (e, from, to) => {
//     e.stopPropagation();
//     setImages((prev) => {
//       const arr = [...prev];
//       const [item] = arr.splice(from, 1);
//       arr.splice(to, 0, item);
//       return arr;
//     });
//   };

//   return (
//     <div className="space-y-3">
//       {/* Drop Zone */}
//       <div
//         onDrop={(e) => {
//           e.preventDefault();
//           handleFiles(e.dataTransfer.files);
//         }}
//         onDragOver={(e) => e.preventDefault()}
//         onClick={() => inputRef.current.click()}
//         className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
//       >
//         <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
//         <p className="text-xs text-gray-400 mt-1">
//           First image will be the main image
//         </p>
//         <input
//           ref={inputRef}
//           type="file"
//           multiple
//           accept="image/*"
//           hidden
//           onChange={(e) => handleFiles(e.target.files)}
//         />
//       </div>

//       {/* Image Grid */}
//       {images.length > 0 && (
//         <div className="grid grid-cols-3 gap-3">
//           {images.map((img, index) => (
//             <div
//               key={index}
//               className={`relative border rounded-md overflow-hidden ${
//                 index === 0 ? "ring-2 ring-blue-500" : ""
//               }`}
//             >
//               <img src={img.preview} className="h-24 w-full object-cover" />

//               {/* Main badge — always on first */}
//               {index === 0 && (
//                 <span className="absolute top-1 left-1 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">
//                   MAIN
//                 </span>
//               )}

//               {/* Remove */}
//               <button
//                 type="button"
//                 onClick={(e) => removeImage(e, index)}
//                 className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
//               >
//                 ✕
//               </button>

//               {/* Reorder arrows */}
//               <div className="absolute bottom-1 left-1 right-1 flex justify-between">
//                 {index > 0 && (
//                   <button
//                     type="button"
//                     onClick={(e) => moveImage(e, index, index - 1)}
//                     className="bg-white text-xs px-1.5 py-0.5 rounded shadow"
//                   >
//                     ←
//                   </button>
//                 )}
//                 {index < images.length - 1 && (
//                   <button
//                     type="button"
//                     onClick={(e) => moveImage(e, index, index + 1)}
//                     className="bg-white text-xs px-1.5 py-0.5 rounded shadow ml-auto"
//                   >
//                     →
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useRef } from "react";

export default function ImageUploader({
  images,
  setImages,
  existingImages = [],
  setExistingImages,
}) {
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const newFiles = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newFiles]);
  };

  const removeNew = (e, index) => {
    e.stopPropagation();
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExisting = (e, index) => {
    e.stopPropagation();
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveExisting = (e, from, to) => {
    e.stopPropagation();
    setExistingImages((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const moveNew = (e, from, to) => {
    e.stopPropagation();
    setImages((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  return (
    <div className="space-y-4">
      {/* ── Existing images from DB ───────────────────── */}
      {existingImages.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium">
            Current Images
          </p>
          <div className="grid grid-cols-3 gap-3">
            {existingImages.map((url, index) => (
              <div
                key={url}
                className={`relative border rounded-md overflow-hidden ${
                  index === 0 ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <img src={url} className="h-24 w-full object-cover" />

                {index === 0 && (
                  <span className="absolute top-1 left-1 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">
                    MAIN
                  </span>
                )}

                {/* Remove */}
                <button
                  type="button"
                  onClick={(e) => removeExisting(e, index)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                >
                  ✕
                </button>

                {/* Reorder */}
                <div className="absolute bottom-1 left-1 right-1 flex justify-between">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={(e) => moveExisting(e, index, index - 1)}
                      className="bg-white text-xs px-1.5 py-0.5 rounded shadow"
                    >
                      ←
                    </button>
                  )}
                  {index < existingImages.length - 1 && (
                    <button
                      type="button"
                      onClick={(e) => moveExisting(e, index, index + 1)}
                      className="bg-white text-xs px-1.5 py-0.5 rounded shadow ml-auto"
                    >
                      →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── New images to upload ──────────────────────── */}
      {images.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium">New Images</p>
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, index) => (
              <div
                key={index}
                className={`relative border rounded-md overflow-hidden ${
                  existingImages.length === 0 && index === 0
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
              >
                <img src={img.preview} className="h-24 w-full object-cover" />

                {existingImages.length === 0 && index === 0 && (
                  <span className="absolute top-1 left-1 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">
                    MAIN
                  </span>
                )}

                {/* Remove */}
                <button
                  type="button"
                  onClick={(e) => removeNew(e, index)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                >
                  ✕
                </button>

                {/* Reorder */}
                <div className="absolute bottom-1 left-1 right-1 flex justify-between">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={(e) => moveNew(e, index, index - 1)}
                      className="bg-white text-xs px-1.5 py-0.5 rounded shadow"
                    >
                      ←
                    </button>
                  )}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={(e) => moveNew(e, index, index + 1)}
                      className="bg-white text-xs px-1.5 py-0.5 rounded shadow ml-auto"
                    >
                      →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Drop Zone ─────────────────────────────────── */}
      <div
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
      >
        <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
        <p className="text-xs text-gray-400 mt-1">
          {existingImages.length === 0 && images.length === 0
            ? "First image will be the main image"
            : "Add more images"}
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
}

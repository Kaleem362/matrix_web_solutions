// import React, { useState, useRef } from "react";
// import altimage from "../../../../Elements/images/altimage.png";

// const AddServicesForm = () => {
//   const [coverImage, setCoverImage] = useState(null);
//   const [serviceIcon, setServiceIcon] = useState(null);
//   const [isDraggingCover, setIsDraggingCover] = useState(false);
//   const [isDraggingIcon, setIsDraggingIcon] = useState(false);
//   const [formData, setFormData] = useState({
//     serviceName: "",
//     serviceTag: "",
//     servicePrice: "",
//     serviceDescription: "",
//     estimatedTimeline: "",
//     serviceFor: "",
//   });

//   const coverInputRef = useRef(null);
//   const iconInputRef = useRef(null);

//   const handleImageUpload = (file, setter) => {
//     if (!file || !file.type.startsWith("image/")) return;
//     const reader = new FileReader();
//     reader.onloadend = () => setter(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form Data:", { coverImage, serviceIcon, ...formData });
//     setFormData({
//       serviceName: "",
//       serviceTag: "",
//       servicePrice: "",
//       serviceDescription: "",
//       estimatedTimeline: "",
//       serviceFor: "",
//     });
//     setCoverImage(null);
//     setServiceIcon(null);
//     if (coverInputRef.current) coverInputRef.current.value = "";
//     if (iconInputRef.current) iconInputRef.current.value = "";
//   };

//   const inputClass =
//     "w-full h-11 px-4 rounded-full border border-indigo-300 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

//   const ImageUploadZone = ({
//     label,
//     hint,
//     value,
//     setter,
//     inputRef,
//     isDragging,
//     setIsDragging,
//     inputId,
//     previewClass,
//     containerClass,
//     iconSize = "cover",
//   }) => (
//     <div className={containerClass}>
//       <label className="block text-xs font-medium text-gray-500 mb-1.5 pl-1">
//         {label}
//       </label>
//       <div
//         onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
//         onDragLeave={() => setIsDragging(false)}
//         onDrop={(e) => {
//           e.preventDefault();
//           setIsDragging(false);
//           handleImageUpload(e.dataTransfer.files[0], setter);
//         }}
//         onClick={() => !value && inputRef.current?.click()}
//         className={`relative rounded-xl border-2 transition-all duration-200 overflow-hidden
//           ${value
//             ? "border-solid border-indigo-500 cursor-default"
//             : `cursor-pointer text-center border-dashed
//                ${isDragging
//                  ? "border-indigo-500 bg-indigo-50"
//                  : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50"
//                }
//                ${iconSize === "cover" ? "p-8" : "p-5"}`
//           }`}
//       >
//         <input
//           ref={inputRef}
//           type="file"
//           id={inputId}
//           accept="image/*"
//           className="hidden"
//           onChange={(e) => handleImageUpload(e.target.files[0], setter)}
//         />

//         {!value ? (
//           <div className="flex flex-col items-center gap-2">
//             <div className={`rounded-full bg-indigo-100 flex items-center justify-center
//               ${iconSize === "cover" ? "w-14 h-14" : "w-10 h-10"}`}>
//               {iconSize === "cover" ? (
//                 <svg className="w-6 h-6 text-indigo-500" viewBox="0 0 24 24" fill="none"
//                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <rect x="3" y="3" width="18" height="18" rx="3" />
//                   <circle cx="8.5" cy="8.5" r="1.5" />
//                   <polyline points="21 15 16 10 5 21" />
//                 </svg>
//               ) : (
//                 <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none"
//                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <circle cx="12" cy="12" r="10" />
//                   <line x1="12" y1="8" x2="12" y2="16" />
//                   <line x1="8" y1="12" x2="16" y2="12" />
//                 </svg>
//               )}
//             </div>
//             <p className="text-sm font-medium text-gray-700">
//               {iconSize === "cover" ? "Click to upload cover image" : "Upload service icon"}
//             </p>
//             <p className="text-xs text-gray-400">or drag and drop</p>
//             <span className="mt-1 inline-block bg-indigo-100 text-indigo-600 text-xs font-medium rounded-full px-4 py-1.5">
//               Browse Files
//             </span>
//             {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
//           </div>
//         ) : (
//           <>
//             <img src={value} alt={label} className={previewClass} />
//             <div
//               onClick={() => inputRef.current?.click()}
//               className="absolute inset-0 bg-indigo-700/65 opacity-0 hover:opacity-100
//                 transition-opacity duration-200 flex flex-col items-center justify-center
//                 gap-2 cursor-pointer"
//             >
//               <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none"
//                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//                 <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//               </svg>
//               <span className="text-white text-xs font-semibold">Change</span>
//             </div>
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setter(null);
//                 if (inputRef.current) inputRef.current.value = "";
//               }}
//               className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50
//                 hover:bg-red-600 text-white text-xs flex items-center justify-center
//                 transition-colors duration-200 z-10"
//             >
//               ✕
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
//       <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

//         {/* Header */}
//         <div className="px-6 py-5 border-b border-gray-100">
//           <h1 className="text-xl font-semibold text-gray-800">Add New Service</h1>
//           <p className="text-sm text-gray-400 mt-0.5">
//             Fill in the details below to publish a new service.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">

//           {/* Cover Image — full width */}
//           <ImageUploadZone
//             label="Cover Image"
//             hint="PNG, JPG, WEBP — max 5 MB"
//             value={coverImage}
//             setter={setCoverImage}
//             inputRef={coverInputRef}
//             isDragging={isDraggingCover}
//             setIsDragging={setIsDraggingCover}
//             inputId="cover-image"
//             previewClass="w-full h-52 object-cover block"
//             containerClass="w-full"
//             iconSize="cover"
//           />

//           {/* Service Icon — smaller, below cover */}
//           <ImageUploadZone
//             label="Service Icon"
//             hint="Square PNG recommended — 512×512px"
//             value={serviceIcon}
//             setter={setServiceIcon}
//             inputRef={iconInputRef}
//             isDragging={isDraggingIcon}
//             setIsDragging={setIsDraggingIcon}
//             inputId="service-icon"
//             previewClass="w-full h-32 object-contain block bg-gray-50 p-2"
//             containerClass="w-full"
//             iconSize="icon"
//           />

//           {/* Service Name */}
//           <div>
//             <label htmlFor="serviceName" className="block text-xs font-medium text-gray-500 mb-1.5 pl-1">
//               Service Name
//             </label>
//             <input
//               type="text"
//               id="serviceName"
//               placeholder="e.g. Logo Design"
//               value={formData.serviceName}
//               onChange={handleInputChange}
//               className={inputClass}
//             />
//           </div>

//           {/* Service Tag */}
//           <div>
//             <label htmlFor="serviceTag" className="block text-xs font-medium text-gray-500 mb-1.5 pl-1">
//               Service Tag
//             </label>
//             <div className="relative">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 text-sm select-none">
//                 #
//               </span>
//               <input
//                 type="text"
//                 id="serviceTag"
//                 placeholder="e.g. design, branding, ui"
//                 value={formData.serviceTag}
//                 onChange={handleInputChange}
//                 className={`${inputClass} pl-8`}
//               />
//             </div>
//             <p className="text-xs text-gray-400 mt-1 pl-1">Separate multiple tags with commas</p>
//           </div>

//           {/* Service Price */}
//           <div>
//             <label htmlFor="servicePrice" className="block text-xs font-medium text-gray-500 mb-1.5 pl-1">
//               Service Price
//             </label>
//             <div className="relative">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 text-sm font-medium select-none">
//                 $
//               </span>
//               <input
//                 type="number"
//                 id="servicePrice"
//                 placeholder="0.00"
//                 min="0"
//                 step="0.01"
//                 value={formData.servicePrice}
//                 onChange={handleInputChange}
//                 className={`${inputClass} pl-8`}
//               />
//             </div>
//           </div>

//           {/* Service Description */}
//           <div>
//             <label htmlFor="serviceDescription" className="block text-xs font-medium text-gray-500 mb-1.5 pl-1">
//               Service Description
//             </label>
//             <textarea
//               id="serviceDescription"
//               placeholder="Describe what this service includes, deliverables, and what clients can expect..."
//               value={formData.serviceDescription}
//               onChange={handleInputChange}
//               rows={4}
//               className="w-full px-4 py-3 rounded-2xl border border-indigo-300 bg-white text-sm
//                 text-gray-800 placeholder-gray-400 outline-none transition-all duration-200
//                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
//             />
//           </div>

//           {/* Estimated Timeline + Service For — side by side */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="estimatedTimeline" className="block text-xs font-medium text-gray-500 mb-1.5 pl-1">
//                 Estimated Timeline
//               </label>
//               <div className="relative">
//                 <input
//                   type="number"
//                   id="estimatedTimeline"
//                   placeholder="e.g. 7"
//                   min="1"
//                   value={formData.estimatedTimeline}
//                   onChange={handleInputChange}
//                   className={`${inputClass} pr-14`}
//                 />
//                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 select-none">
//                   days
//                 </span>
//               </div>
//             </div>

//             <div>
//               <label htmlFor="serviceFor" className="block text-xs font-medium text-gray-500 mb-1.5 pl-1">
//                 Service For
//               </label>
//               <select
//                 id="serviceFor"
//                 value={formData.serviceFor}
//                 onChange={handleInputChange}
//                 className={`${inputClass} cursor-pointer appearance-none bg-no-repeat`}
//                 style={{
//                   backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
//                   backgroundPosition: "right 14px center",
//                   paddingRight: "36px",
//                 }}
//               >
//                 <option value="" disabled>Select target</option>
//                 <option value="individuals">Individuals</option>
//                 <option value="startups">Startups</option>
//                 <option value="small_businesses">Small Businesses</option>
//                 <option value="enterprises">Enterprises</option>
//                 <option value="nonprofits">Non-profits</option>
//                 <option value="agencies">Agencies</option>
//                 <option value="everyone">Everyone</option>
//               </select>
//             </div>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="w-full h-11 bg-indigo-500 hover:bg-indigo-600 active:scale-95
//               text-white text-sm font-semibold rounded-full transition-all duration-200 mt-2"
//           >
//             Publish Service
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddServicesForm;



import React, { useState, useRef, useEffect, useCallback } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── TOAST ────────────────────────────────────────────────────────────────────
const Toast = ({ toasts, remove }) => (
  <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium min-w-72 max-w-sm
          transition-all duration-300 animate-slide-in
          ${t.type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : t.type === "error"
            ? "bg-red-50 border-red-200 text-red-800"
            : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
      >
        <span className="text-base mt-0.5">
          {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}
        </span>
        <span className="flex-1">{t.message}</span>
        <button
          onClick={() => remove(t.id)}
          className="text-gray-400 hover:text-gray-600 ml-1 text-xs leading-none mt-0.5"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
);

const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);
  const remove = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);
  return { toasts, add, remove };
};

// ─── IMAGE UPLOAD ZONE ────────────────────────────────────────────────────────
const ImageUploadZone = ({
  label, hint, value, setter, inputRef,
  isDragging, setIsDragging, inputId,
  previewClass, containerClass, iconSize = "cover",
}) => {
  const handleImageUpload = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className={containerClass}>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">
        {label}
      </label>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleImageUpload(e.dataTransfer.files[0]); }}
        onClick={() => !value && inputRef.current?.click()}
        className={`relative rounded-2xl border-2 transition-all duration-200 overflow-hidden
          ${value
            ? "border-solid border-indigo-400 cursor-default"
            : `cursor-pointer text-center border-dashed
               ${isDragging ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50"}
               ${iconSize === "cover" ? "p-10" : "p-5"}`
          }`}
      >
        <input ref={inputRef} type="file" id={inputId} accept="image/*" className="hidden"
          onChange={(e) => handleImageUpload(e.target.files[0])} />
        {!value ? (
          <div className="flex flex-col items-center gap-2">
            <div className={`rounded-2xl bg-indigo-100 flex items-center justify-center
              ${iconSize === "cover" ? "w-14 h-14" : "w-10 h-10"}`}>
              {iconSize === "cover" ? (
                <svg className="w-6 h-6 text-indigo-500" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              )}
            </div>
            <p className="text-sm font-semibold text-slate-700">
              {iconSize === "cover" ? "Drop cover image here" : "Drop icon here"}
            </p>
            <p className="text-xs text-slate-400">or click to browse</p>
            {hint && <p className="text-xs text-slate-400">{hint}</p>}
          </div>
        ) : (
          <>
            <img src={value} alt={label} className={previewClass} />
            <div onClick={() => inputRef.current?.click()}
              className="absolute inset-0 bg-indigo-900/60 opacity-0 hover:opacity-100
                transition-opacity duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span className="text-white text-xs font-semibold">Change</span>
            </div>
            <button type="button"
              onClick={(e) => { e.stopPropagation(); setter(null); if (inputRef.current) inputRef.current.value = ""; }}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 hover:bg-red-600
                text-white text-xs flex items-center justify-center transition-colors duration-200 z-10">
              ✕
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── VALIDATION ───────────────────────────────────────────────────────────────
const validate = (formData, coverImage, serviceIcon) => {
  const errors = {};
  if (!coverImage) errors.coverImage = "Cover image is required";
  if (!serviceIcon) errors.serviceIcon = "Service icon is required";
  if (!formData.serviceName.trim()) errors.serviceName = "Service name is required";
  if (!formData.serviceTag.trim()) errors.serviceTag = "At least one tag is required";
  if (!formData.servicePrice || Number(formData.servicePrice) <= 0) errors.servicePrice = "Enter a valid price";
  if (!formData.serviceDescription.trim() || formData.serviceDescription.trim().length < 20)
    errors.serviceDescription = "Description must be at least 20 characters";
  if (!formData.estimatedTimeline || Number(formData.estimatedTimeline) < 1)
    errors.estimatedTimeline = "Enter a valid number of days";
  if (!formData.serviceFor) errors.serviceFor = "Please select a target audience";
  return errors;
};

// ─── ADD SERVICE FORM ─────────────────────────────────────────────────────────
const AddServiceForm = ({ onSuccess, toast }) => {
  const [coverImage, setCoverImage] = useState(null);
  const [serviceIcon, setServiceIcon] = useState(null);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [isDraggingIcon, setIsDraggingIcon] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    serviceName: "", serviceTag: "", servicePrice: "",
    serviceDescription: "", estimatedTimeline: "", serviceFor: "",
  });

  const coverInputRef = useRef(null);
  const iconInputRef = useRef(null);

  const inputClass = (field) =>
    `w-full h-11 px-4 rounded-xl border bg-white text-sm text-slate-800 placeholder-slate-400
     outline-none transition-all duration-200
     ${errors[field] && touched[field]
       ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
       : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
     }`;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((p) => ({ ...p, [id]: value }));
    if (errors[id]) setErrors((p) => ({ ...p, [id]: undefined }));
  };

  const handleBlur = (field) => setTouched((p) => ({ ...p, [field]: true }));

  const resetForm = () => {
    setFormData({ serviceName: "", serviceTag: "", servicePrice: "", serviceDescription: "", estimatedTimeline: "", serviceFor: "" });
    setCoverImage(null); setServiceIcon(null);
    setErrors({}); setTouched({});
    if (coverInputRef.current) coverInputRef.current.value = "";
    if (iconInputRef.current) iconInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      ["coverImage","serviceIcon","serviceName","serviceTag","servicePrice","serviceDescription","estimatedTimeline","serviceFor"]
        .map((k) => [k, true])
    );
    setTouched(allTouched);

    const errs = validate(formData, coverImage, serviceIcon);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast("Please fix the errors before submitting.", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        image: coverImage,
        icon: serviceIcon,
        serviceName: formData.serviceName.trim(),
        serviceTags: formData.serviceTag.split(",").map((t) => t.trim()).filter(Boolean),
        servicePrice: Number(formData.servicePrice),
        serviceDescription: formData.serviceDescription.trim(),
        estimatedTime: Number(formData.estimatedTimeline),
        serviceFor: formData.serviceFor,
      };

      const res = await fetch(`${API_BASE}/api/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create service");

      toast("Service published successfully! 🎉", "success");
      resetForm();
      onSuccess();
    } catch (err) {
      toast(err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const FieldError = ({ field }) =>
    errors[field] && touched[field]
      ? <p className="text-xs text-red-500 mt-1 pl-1">{errors[field]}</p>
      : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <h2 className="text-lg font-bold text-slate-800">Add New Service</h2>
        <p className="text-sm text-slate-400 mt-0.5">Fill in the details to publish a new service.</p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
        {/* Images row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <ImageUploadZone
              label="Cover Image" hint="PNG, JPG, WEBP — max 5MB"
              value={coverImage} setter={setCoverImage}
              inputRef={coverInputRef} isDragging={isDraggingCover}
              setIsDragging={setIsDraggingCover} inputId="cover-image"
              previewClass="w-full h-44 object-cover block"
              containerClass="w-full" iconSize="cover"
            />
            <FieldError field="coverImage" />
          </div>
          <div>
            <ImageUploadZone
              label="Service Icon" hint="Square PNG — 512×512px recommended"
              value={serviceIcon} setter={setServiceIcon}
              inputRef={iconInputRef} isDragging={isDraggingIcon}
              setIsDragging={setIsDraggingIcon} inputId="service-icon"
              previewClass="w-full h-44 object-contain block bg-slate-50 p-4"
              containerClass="w-full" iconSize="icon"
            />
            <FieldError field="serviceIcon" />
          </div>
        </div>

        {/* Service Name */}
        <div>
          <label htmlFor="serviceName" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">
            Service Name
          </label>
          <input type="text" id="serviceName" placeholder="e.g. Logo Design"
            value={formData.serviceName} onChange={handleInputChange}
            onBlur={() => handleBlur("serviceName")} className={inputClass("serviceName")} />
          <FieldError field="serviceName" />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="serviceTag" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">
            Service Tags
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 text-sm select-none">#</span>
            <input type="text" id="serviceTag" placeholder="design, branding, ui"
              value={formData.serviceTag} onChange={handleInputChange}
              onBlur={() => handleBlur("serviceTag")}
              className={`${inputClass("serviceTag")} pl-8`} />
          </div>
          <p className="text-xs text-slate-400 mt-1 pl-1">Separate multiple tags with commas</p>
          <FieldError field="serviceTag" />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="servicePrice" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">
            Service Price
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 text-sm font-semibold select-none">$</span>
            <input type="number" id="servicePrice" placeholder="0.00" min="0" step="0.01"
              value={formData.servicePrice} onChange={handleInputChange}
              onBlur={() => handleBlur("servicePrice")}
              className={`${inputClass("servicePrice")} pl-8`} />
          </div>
          <FieldError field="servicePrice" />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="serviceDescription" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">
            Service Description
          </label>
          <textarea id="serviceDescription"
            placeholder="Describe what this service includes, deliverables, and what clients can expect..."
            value={formData.serviceDescription} onChange={handleInputChange}
            onBlur={() => handleBlur("serviceDescription")} rows={4}
            className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-slate-800
              placeholder-slate-400 outline-none transition-all duration-200 resize-none
              ${errors.serviceDescription && touched.serviceDescription
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              }`} />
          <div className="flex justify-between mt-1 pl-1">
            <FieldError field="serviceDescription" />
            <span className={`text-xs ml-auto ${formData.serviceDescription.length < 20 ? "text-slate-400" : "text-emerald-500"}`}>
              {formData.serviceDescription.length} chars
            </span>
          </div>
        </div>

        {/* Timeline + ServiceFor */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="estimatedTimeline" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">
              Timeline
            </label>
            <div className="relative">
              <input type="number" id="estimatedTimeline" placeholder="7" min="1"
                value={formData.estimatedTimeline} onChange={handleInputChange}
                onBlur={() => handleBlur("estimatedTimeline")}
                className={`${inputClass("estimatedTimeline")} pr-14`} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 select-none">days</span>
            </div>
            <FieldError field="estimatedTimeline" />
          </div>

          <div>
            <label htmlFor="serviceFor" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-1">
              Service For
            </label>
            <select id="serviceFor" value={formData.serviceFor} onChange={handleInputChange}
              onBlur={() => handleBlur("serviceFor")}
              className={`${inputClass("serviceFor")} cursor-pointer appearance-none`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
                paddingRight: "36px",
              }}>
              <option value="" disabled>Select target</option>
              <option value="individuals">Individuals</option>
              <option value="startups">Startups</option>
              <option value="small_businesses">Small Businesses</option>
              <option value="enterprises">Enterprises</option>
              <option value="nonprofits">Non-profits</option>
              <option value="agencies">Agencies</option>
              <option value="everyone">Everyone</option>
            </select>
            <FieldError field="serviceFor" />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}
          className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300
            text-white text-sm font-bold rounded-xl transition-all duration-200 active:scale-95
            flex items-center justify-center gap-2 mt-2">
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Publishing...
            </>
          ) : "Publish Service"}
        </button>
      </form>
    </div>
  );
};

// ─── SERVICE CARD ─────────────────────────────────────────────────────────────
const ServiceCard = ({ service, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(service._id);
    setDeleting(false);
    setConfirm(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden
      hover:shadow-md hover:border-indigo-100 transition-all duration-200">
      {/* Cover */}
      <div className="relative h-40 bg-slate-100">
        <img src={service.image} alt={service.serviceName}
          className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3">
          <img src={service.icon} alt="icon"
            className="w-10 h-10 rounded-xl border-2 border-white shadow object-contain bg-white p-1" />
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg">
            ${service.servicePrice}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-bold text-slate-800 text-sm truncate">{service.serviceName}</h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{service.serviceDescription}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {service.serviceTags?.slice(0, 3).map((tag) => (
            <span key={tag} className="bg-indigo-50 text-indigo-600 text-xs font-medium px-2 py-0.5 rounded-lg">
              #{tag}
            </span>
          ))}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
          <span>⏱ {service.estimatedTime}d</span>
          <span>👥 {service.serviceFor?.replace("_", " ")}</span>
        </div>

        {/* Delete */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          {!confirm ? (
            <button onClick={() => setConfirm(true)}
              className="w-full h-9 rounded-xl border border-red-200 text-red-500 text-xs font-semibold
                hover:bg-red-50 transition-all duration-150">
              Delete Service
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setConfirm(false)}
                className="flex-1 h-9 rounded-xl border border-slate-200 text-slate-500 text-xs font-semibold
                  hover:bg-slate-50 transition-all duration-150">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 h-9 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold
                  transition-all duration-150 flex items-center justify-center gap-1">
                {deleting ? (
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : "Confirm Delete"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── ALL SERVICES LIST ────────────────────────────────────────────────────────
const AllServicesList = ({ toast, refreshKey }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/services`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      setServices(data.data || []);
    } catch (err) {
      toast(err.message || "Could not load services", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchServices(); }, [fetchServices, refreshKey]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/services/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      toast("Service deleted successfully", "success");
      setServices((p) => p.filter((s) => s._id !== id));
    } catch (err) {
      toast(err.message || "Could not delete service", "error");
    }
  };

  const filtered = services.filter((s) =>
    s.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
    s.serviceTags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">All Services</h2>
          <p className="text-sm text-slate-400">{services.length} service{services.length !== 1 ? "s" : ""} published</p>
        </div>
        <div className="relative w-full sm:w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search services..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 text-sm text-slate-800
              placeholder-slate-400 bg-white outline-none focus:border-indigo-400 focus:ring-2
              focus:ring-indigo-100 transition-all duration-200" />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
              <div className="h-40 bg-slate-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded-lg w-3/4" />
                <div className="h-3 bg-slate-100 rounded-lg" />
                <div className="h-3 bg-slate-100 rounded-lg w-5/6" />
                <div className="flex gap-2 mt-2">
                  <div className="h-5 w-16 bg-slate-100 rounded-lg" />
                  <div className="h-5 w-16 bg-slate-100 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-400" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p className="text-slate-600 font-semibold">
            {search ? "No services match your search" : "No services yet"}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            {search ? "Try a different keyword" : "Add your first service using the form above"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <ServiceCard key={s._id} service={s} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ServicesManager = () => {
  const [view, setView] = useState("add"); // "add" | "list"
  const [refreshKey, setRefreshKey] = useState(0);
  const { toasts, add: toast, remove } = useToast();

  const handleSuccess = () => {
    setRefreshKey((k) => k + 1);
    setTimeout(() => setView("list"), 800);
  };

  return (
    <>
      {/* Inline keyframes */}
      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 0.25s ease-out both; }
      `}</style>

      <Toast toasts={toasts} remove={remove} />

      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Services</h1>
              <p className="text-sm text-slate-400 mt-0.5">Manage your agency's service offerings</p>
            </div>

            {/* Toggle */}
            <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1 w-fit">
              {[
                { key: "add", label: "Add Service", icon: "+" },
                { key: "list", label: "All Services", icon: "☰" },
              ].map(({ key, label, icon }) => (
                <button key={key} onClick={() => setView(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                    transition-all duration-200
                    ${view === key
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    }`}>
                  <span>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Render */}
          {view === "add" ? (
            <AddServiceForm onSuccess={handleSuccess} toast={toast} />
          ) : (
            <AllServicesList toast={toast} refreshKey={refreshKey} />
          )}
        </div>
      </div>
    </>
  );
};

export default ServicesManager;
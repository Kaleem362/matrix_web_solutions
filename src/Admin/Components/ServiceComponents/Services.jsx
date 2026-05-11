import React, { useState, useRef, useEffect, useCallback } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { MdDeleteOutline, MdOutlineAdd } from "react-icons/md";
import { HiOutlineSearch, HiOutlineCog } from "react-icons/hi";
import { BsGrid3X3Gap } from "react-icons/bs";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── TOAST ────────────────────────────────────────────────────────────────────
const ToastContainer = ({ toasts, onClose }) => (
  <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`pointer-events-auto flex items-start gap-3 bg-white rounded-xl border shadow-md px-4 py-3 min-w-65 max-w-xs transition-all
          ${t.type === "success" ? "border-green-200" : t.type === "error" ? "border-red-200" : "border-blue-200"}`}
      >
        <div
          className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0
            ${t.type === "success" ? "bg-green-100" : t.type === "error" ? "bg-red-100" : "bg-blue-100"}`}
        >
          {t.type === "success" && (
            <svg className="w-3 h-3 text-green-600" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {t.type === "error" && (
            <svg className="w-3 h-3 text-red-600" viewBox="0 0 12 12" fill="none">
              <path d="M3 9L9 3M3 3l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
          {t.type === "info" && (
            <svg className="w-3 h-3 text-blue-600" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M6 5.5V9M6 4v-.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 leading-snug">{t.title}</p>
          {t.message && (
            <p className="text-xs text-gray-500 mt-0.5 leading-snug">{t.message}</p>
          )}
        </div>
        <button
          onClick={() => onClose(t.id)}
          className="text-gray-300 hover:text-gray-500 text-sm leading-none mt-0.5"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
);

const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((title, type = "info", message = "") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, title, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);
  const remove = useCallback(
    (id) => setToasts((p) => p.filter((t) => t.id !== id)),
    [],
  );
  return { toasts, add, remove };
};

// ─── IMAGE UPLOAD ZONE ────────────────────────────────────────────────────────
const ImageUploadZone = ({
  label,
  hint,
  value,
  setter,
  inputRef,
  isDragging,
  setIsDragging,
  inputId,
  previewClass,
  iconSize = "cover",
}) => {
  const handleImageUpload = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 pl-1">
        {label}
      </label>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleImageUpload(e.dataTransfer.files[0]);
        }}
        onClick={() => !value && inputRef.current?.click()}
        className={`relative rounded-2xl border-2 transition-all duration-200 overflow-hidden
          ${value
            ? "border-solid border-indigo-300 cursor-default"
            : `cursor-pointer text-center border-dashed
               ${isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50"}
               ${iconSize === "cover" ? "p-10" : "p-5"}`
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          id={inputId}
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />
        {!value ? (
          <div className="flex flex-col items-center gap-2">
            <div className={`rounded-2xl bg-indigo-100 flex items-center justify-center ${iconSize === "cover" ? "w-14 h-14" : "w-10 h-10"}`}>
              <svg className={`text-indigo-500 ${iconSize === "cover" ? "w-6 h-6" : "w-5 h-5"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {iconSize === "cover" ? (
                  <>
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </>
                ) : (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </>
                )}
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-700">
              {iconSize === "cover" ? "Drop cover image here" : "Drop icon here"}
            </p>
            <p className="text-xs text-gray-400">or click to browse</p>
            {hint && <p className="text-xs text-gray-400">{hint}</p>}
          </div>
        ) : (
          <>
            <img src={value} alt={label} className={previewClass} />
            <div
              onClick={() => inputRef.current?.click()}
              className="absolute inset-0 bg-indigo-900/60 opacity-0 hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span className="text-white text-xs font-semibold">Change</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setter(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 hover:bg-red-600 text-white text-xs flex items-center justify-center transition-colors duration-200 z-10"
            >
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
    `w-full h-11 px-4 rounded-xl border bg-white text-sm text-gray-800 placeholder-gray-400
     outline-none transition-all duration-200
     ${errors[field] && touched[field]
       ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
       : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((p) => ({ ...p, [id]: value }));
    if (errors[id]) setErrors((p) => ({ ...p, [id]: undefined }));
  };

  const handleBlur = (field) => setTouched((p) => ({ ...p, [field]: true }));

  const resetForm = () => {
    setFormData({ serviceName: "", serviceTag: "", servicePrice: "", serviceDescription: "", estimatedTimeline: "", serviceFor: "" });
    setCoverImage(null);
    setServiceIcon(null);
    setErrors({});
    setTouched({});
    if (coverInputRef.current) coverInputRef.current.value = "";
    if (iconInputRef.current) iconInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      ["coverImage", "serviceIcon", "serviceName", "serviceTag", "servicePrice", "serviceDescription", "estimatedTimeline", "serviceFor"].map((k) => [k, true]),
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

      toast("Service published successfully!", "success");
      resetForm();
      onSuccess();
    } catch (err) {
      toast(err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const FieldError = ({ field }) =>
    errors[field] && touched[field] ? (
      <p className="text-xs text-red-500 mt-1 pl-1">{errors[field]}</p>
    ) : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Form Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/60">
        <h2 className="text-base font-bold text-gray-800">New Service Details</h2>
        <p className="text-sm text-gray-400 mt-0.5">Fill in the details to publish a new service offering.</p>
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
              iconSize="cover"
            />
            <FieldError field="coverImage" />
          </div>
          <div>
            <ImageUploadZone
              label="Service Icon" hint="Square PNG — 512×512px recommended"
              value={serviceIcon} setter={setServiceIcon}
              inputRef={iconInputRef} isDragging={isDraggingIcon}
              setIsDragging={setIsDraggingIcon} inputId="service-icon"
              previewClass="w-full h-44 object-contain block bg-gray-50 p-4"
              iconSize="icon"
            />
            <FieldError field="serviceIcon" />
          </div>
        </div>

        {/* Service Name */}
        <div>
          <label htmlFor="serviceName" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 pl-1">
            Service Name
          </label>
          <input type="text" id="serviceName" placeholder="e.g. Logo Design"
            value={formData.serviceName} onChange={handleInputChange}
            onBlur={() => handleBlur("serviceName")} className={inputClass("serviceName")} />
          <FieldError field="serviceName" />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="serviceTag" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 pl-1">
            Service Tags
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 text-sm select-none">#</span>
            <input type="text" id="serviceTag" placeholder="design, branding, ui"
              value={formData.serviceTag} onChange={handleInputChange}
              onBlur={() => handleBlur("serviceTag")} className={`${inputClass("serviceTag")} pl-8`} />
          </div>
          <p className="text-xs text-gray-400 mt-1 pl-1">Separate multiple tags with commas</p>
          <FieldError field="serviceTag" />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="servicePrice" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 pl-1">
            Service Price
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 text-sm font-semibold select-none">$</span>
            <input type="number" id="servicePrice" placeholder="0.00" min="0" step="0.01"
              value={formData.servicePrice} onChange={handleInputChange}
              onBlur={() => handleBlur("servicePrice")} className={`${inputClass("servicePrice")} pl-8`} />
          </div>
          <FieldError field="servicePrice" />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="serviceDescription" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 pl-1">
            Service Description
          </label>
          <textarea
            id="serviceDescription"
            placeholder="Describe what this service includes, deliverables, and what clients can expect..."
            value={formData.serviceDescription} onChange={handleInputChange}
            onBlur={() => handleBlur("serviceDescription")} rows={4}
            className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-gray-800
              placeholder-gray-400 outline-none transition-all duration-200 resize-none
              ${errors.serviceDescription && touched.serviceDescription
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`}
          />
          <div className="flex justify-between mt-1 pl-1">
            <FieldError field="serviceDescription" />
            <span className={`text-xs ml-auto ${formData.serviceDescription.length < 20 ? "text-gray-400" : "text-emerald-500"}`}>
              {formData.serviceDescription.length} chars
            </span>
          </div>
        </div>

        {/* Timeline + ServiceFor */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="estimatedTimeline" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 pl-1">
              Timeline
            </label>
            <div className="relative">
              <input type="number" id="estimatedTimeline" placeholder="7" min="1"
                value={formData.estimatedTimeline} onChange={handleInputChange}
                onBlur={() => handleBlur("estimatedTimeline")} className={`${inputClass("estimatedTimeline")} pr-14`} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 select-none">days</span>
            </div>
            <FieldError field="estimatedTimeline" />
          </div>
          <div>
            <label htmlFor="serviceFor" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 pl-1">
              Service For
            </label>
            <select
              id="serviceFor" value={formData.serviceFor}
              onChange={handleInputChange} onBlur={() => handleBlur("serviceFor")}
              className={`${inputClass("serviceFor")} cursor-pointer appearance-none`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
                paddingRight: "36px",
              }}
            >
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
        <button
          type="submit" disabled={loading}
          className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300
            text-white text-sm font-bold rounded-xl transition-all duration-200 active:scale-95
            flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Publishing...
            </>
          ) : (
            <>
              <MdOutlineAdd className="text-lg" />
              Publish Service
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// ─── SERVICE TILE ─────────────────────────────────────────────────────────────
const ServiceTile = ({ service, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(service._id);
    setDeleting(false);
    setConfirm(false);
  };

  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:gap-5">

      {/* Cover thumbnail */}
      <div className="relative shrink-0 h-16 w-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
        <img src={service.image} alt={service.serviceName} className="w-full h-full object-cover" />
        {service.icon && (
          <img
            src={service.icon} alt="icon"
            className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg border-2 border-white object-contain bg-white p-0.5 shadow-sm"
          />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Name + price badge */}
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-gray-900">{service.serviceName}</p>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100">
            ${service.servicePrice}
          </span>
          <span className="rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-500 ring-1 ring-gray-100 capitalize">
            {service.serviceFor?.replace("_", " ")}
          </span>
        </div>

        {/* Meta row */}
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-xs text-gray-400">⏱ {service.estimatedTime} days</span>
          {service.serviceTags?.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs text-indigo-400 font-medium">#{tag}</span>
          ))}
        </div>

        {/* Description */}
        <p className="mt-1.5 line-clamp-1 text-sm leading-relaxed text-gray-400">
          {service.serviceDescription}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
        {!confirm ? (
          <button
            onClick={() => setConfirm(true)}
            title="Delete service"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-400 transition hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
          >
            <MdDeleteOutline className="text-lg" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setConfirm(false)}
              className="h-9 rounded-xl border border-gray-200 px-3 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="h-9 rounded-xl bg-red-500 hover:bg-red-600 text-white px-3 text-xs font-bold transition flex items-center gap-1 disabled:opacity-60"
            >
              {deleting ? (
                <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : "Confirm"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

// ─── ALL SERVICES LIST ────────────────────────────────────────────────────────
const AllServicesList = ({ toast, refreshKey, search = "" }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchServices();
  }, [fetchServices, refreshKey]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/services/${id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      toast("Service deleted successfully", "success");
      setServices((p) => p.filter((s) => s._id !== id));
    } catch (err) {
      toast(err.message || "Could not delete service", "error");
    }
  };

  const filtered = services.filter(
    (s) =>
      s.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
      s.serviceTags?.some((t) => t.toLowerCase().includes(search.toLowerCase())),
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 animate-pulse">
            <div className="h-16 w-16 rounded-xl bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded-lg w-1/3" />
              <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
              <div className="h-3 bg-gray-100 rounded-lg w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
        <BsGrid3X3Gap className="mb-3 text-5xl text-gray-200" />
        <p className="text-base font-semibold text-gray-400">
          {search ? "No services match your search" : "No services yet"}
        </p>
        <p className="mt-1 text-sm text-gray-400">
          {search ? "Try a different keyword." : "Switch to Add Service to publish your first one."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {filtered.map((s) => (
        <ServiceTile key={s._id} service={s} onDelete={handleDelete} />
      ))}
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const Services = () => {
  const [view, setView] = useState("list");
  const [refreshKey, setRefreshKey] = useState(0);
  const { toasts, add: toast, remove } = useToast();
  const [search, setSearch] = useState("");

  const handleSuccess = () => {
    setRefreshKey((k) => k + 1);
    setTimeout(() => setView("list"), 800);
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={remove} />
    <AdminLayout>

      <section className="min-h-screen px-1 py-2 sm:px-2">

        {/* ── Page Header ── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
              <HiOutlineCog className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Services</h2>
              <p className="text-sm text-gray-500">Manage your agency's service offerings</p>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-gray-100 bg-gray-50 p-1 w-fit">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                view === "list"
                  ? "bg-white text-indigo-700 shadow-sm ring-1 ring-gray-100"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <BsGrid3X3Gap className="text-base" />
              All Services
            </button>
            <button
              onClick={() => setView("add")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                view === "add"
                  ? "bg-white text-indigo-700 shadow-sm ring-1 ring-gray-100"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <MdOutlineAdd className="text-base" />
              Add Service
            </button>
          </div>
        </div>

        {/* ── Search bar (list view only) ── */}
        {view === "list" && (
          <div className="mb-6 relative w-full sm:max-w-sm">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or tag…"
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
        )}

        {/* ── Views ── */}
        {view === "add" ? (
          <AddServiceForm onSuccess={handleSuccess} toast={toast} />
        ) : (
          <AllServicesList toast={toast} refreshKey={refreshKey} search={search} />
        )}
      </section>
    </AdminLayout>
    </>
  );
};

export default Services;
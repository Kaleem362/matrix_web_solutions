const STORAGE_KEYS = {
  quotes: "seenQuotes",
  contacts: "seenContacts",
  testimonials: "seenTestimonials",
};

export const getSeenItems = (type) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS[type]);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const setSeenItems = (type, ids) => {
  try {
    localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(ids));
  } catch (e) {
    console.error("Failed to save seen items:", e);
  }
};

export const markAsSeen = (type, ids) => {
  const seen = new Set(getSeenItems(type));
  ids.forEach((id) => seen.add(id));
  setSeenItems(type, Array.from(seen));
};

export const getUnreadCount = (type, items) => {
  const seen = new Set(getSeenItems(type));
  return items.filter((item) => !seen.has(item._id)).length;
};
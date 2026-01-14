const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  },
};

export const getSession = async () => {
  return null;
};

export const createTemporaryUserId = (): string => {
  const localUserId = safeLocalStorage.getItem("tempUserId");
  if (localUserId) {
    return localUserId;
  }

  const newId = "temp-" + Math.random().toString(36).substring(2, 15);
  safeLocalStorage.setItem("tempUserId", newId);
  return newId;
};

export const ensureAuthSession = async (): Promise<string> => {
  return createTemporaryUserId();
};

export const getCurrentUserId = async (): Promise<string> => {
  return createTemporaryUserId();
};

let pendingRequests = 0;
const subscribers = new Set();

const emit = () => {
  const isLoading = pendingRequests > 0;
  subscribers.forEach((callback) => callback(isLoading));
};

export const startGlobalRequest = () => {
  pendingRequests += 1;
  emit();
};

export const finishGlobalRequest = () => {
  pendingRequests = Math.max(0, pendingRequests - 1);
  emit();
};

export const subscribeGlobalLoading = (callback) => {
  subscribers.add(callback);
  callback(pendingRequests > 0);

  return () => {
    subscribers.delete(callback);
  };
};

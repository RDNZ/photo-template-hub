export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const formatTurnaroundTime = (time: string) => {
  const timeMap: Record<string, string> = {
    "3d": "3 Day Turnaround",
    "2d": "2 Day Turnaround",
    "1d": "1 Day Turnaround",
    "12h": "12 Hour Turnaround",
  };
  return timeMap[time] || time;
};

export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "submitted":
      return "default";
    case "in_progress":
      return "secondary";
    case "preview_ready":
      return "outline";
    case "completed":
      return "secondary";
    default:
      return "default";
  }
};
export const calculateOrderPrice = (
  softwareType: string,
  turnaroundTime: string,
  hasDarkroomFile: boolean = false
): number => {
  // Base price for all orders
  let basePrice = 15;

  // Add turnaround time fee
  switch (turnaroundTime) {
    case "3d":
      basePrice += 15;
      break;
    case "2d":
      basePrice += 20;
      break;
    case "1d":
      basePrice += 25;
      break;
    case "12h":
      basePrice += 30;
      break;
    default:
      basePrice += 15; // Default to 3-day turnaround
  }

  // Add darkroom file fee if applicable
  if (softwareType === "darkroom_booth_3" && hasDarkroomFile) {
    basePrice += 10;
  }

  return basePrice;
};
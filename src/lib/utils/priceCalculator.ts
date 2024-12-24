export const calculateOrderPrice = (softwareType: string, turnaroundTime: string): number => {
  let basePrice = 0;
  
  switch (softwareType) {
    case "photoshop":
      basePrice = 50;
      break;
    case "illustrator":
      basePrice = 75;
      break;
    case "after_effects":
      basePrice = 100;
      break;
    default:
      basePrice = 50;
  }

  // Add rush fee for faster turnaround
  switch (turnaroundTime) {
    case "24h":
      return Math.round(basePrice * 1.5);
    case "48h":
      return Math.round(basePrice * 1.25);
    default:
      return basePrice;
  }
};
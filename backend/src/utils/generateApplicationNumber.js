/**
 * Generates a unique application number for grievances
 * @returns {string} Formatted application number with timestamp and random digits
 */
const generateApplicationNumber = () => {
  return `GRV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

module.exports = generateApplicationNumber;

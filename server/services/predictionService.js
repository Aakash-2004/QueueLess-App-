// AI Waiting Time Prediction Service
const Token = require('../models/Token');
const Service = require('../models/Service');

// Simulated AI prediction model configuration
const TIME_CONFIG = {
  averageServiceTimeMin: 15, // Baseline: 15 minutes per person
  peakHourMultiplier: 1.5,   // Peak hours (10 AM - 2 PM) take 50% longer
  rushDayMultiplier: 1.2,    // Mondays and Fridays are typically 20% busier
};

/**
 * Predicts the waiting time for a specific service queue based on historical metrics
 * @param {String} serviceId - The ID of the service
 * @returns {Promise<Object>} The prediction details
 */
exports.predictWaitTime = async (serviceId) => {
  try {
    const service = await Service.findById(serviceId);
    if (!service) throw new Error('Service not found');

    // Get current queue length for this service
    const queueLength = await Token.countDocuments({
      serviceId,
      status: 'WAITING'
    });

    // Get current time factors
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 (Sun) to 6 (Sat)

    let currentAverageTime = TIME_CONFIG.averageServiceTimeMin;

    // Apply Peak Hour Multiplier (10 AM to 2 PM)
    if (currentHour >= 10 && currentHour <= 14) {
      currentAverageTime *= TIME_CONFIG.peakHourMultiplier;
    }

    // Apply Rush Day Multiplier (Monday=1, Friday=5)
    if (currentDay === 1 || currentDay === 5) {
      currentAverageTime *= TIME_CONFIG.rushDayMultiplier;
    }

    // Calculate prediction (Total wait time = Queue Length * Adjusted Average Time)
    const predictedWaitTimeMinutes = Math.round(queueLength * currentAverageTime);

    return {
      serviceId,
      serviceName: service.serviceName,
      queueLength,
      predictedWaitTimeMinutes,
      estimatedWaitText: formatWaitTime(predictedWaitTimeMinutes)
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Formats raw minutes into a readable text string
 */
function formatWaitTime(minutes) {
  if (minutes === 0) return 'Immediate';
  if (minutes < 60) return `${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return `${hours} hr ${remainingMins} mins`;
}

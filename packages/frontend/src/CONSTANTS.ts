export const CONSTANTS = {
  BACKEND_URL: ``,
  ENDPOINTS: {
    GET_PLANT_NAME: `/name?index=0`,
    GET_SYSTEM_DETAILS: `/plantsDetails`,
    POST_PLANT_NAME: `/name`,
    POST_WATER_THRESHOLD: `/updateThreshold`,
    SET_WATERING_MODE: `/setWateringMode`,
    TOGGLE_WATERING: `/toggleWater`,
    GET_SCHEDULE: `/schedule`,
    POST_SCHEDULE: `/schedule`,
  },
} as const;

/**
 * Centralized booking URLs — single source of truth.
 *
 * When Cal.com is ready, change the URLs here.
 * Every page in the site imports from this file.
 * One edit, 28 references updated.
 */

export const BOOKING = {
  /** General booking hub — all services */
  general: "/book-online",

  /** CNA/CBRF Training Orientation */
  cnaCbrf: "/book-online#cna-cbrf",

  /** Construction Training Orientation */
  construction: "/book-online#construction",

  /** Career Development Assistance — by appointment, routed through inquiry form */
  careerDevelopment: "/programs/career-development/inquire",

  /** Mental Health Counseling — by appointment, routed through inquiry form */
  mentalHealth: "/programs/mental-health/inquire",

  /** Financial Literacy — by appointment, routed through inquiry form */
  financialLiteracy: "/programs/financial-literacy/inquire",
};

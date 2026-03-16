
/**
 * Simple Ethiopian Calendar Utility
 */

export const getEthiopianDate = (date: Date = new Date()) => {
  const gregorianYear = date.getFullYear();
  const gregorianMonth = date.getMonth() + 1; // 1-12
  const gregorianDay = date.getDate();

  let ethiopianYear = gregorianYear - 8;
  let ethiopianMonth = 0;
  let ethiopianDay = 0;

  // Ethiopian New Year is usually Sept 11 (or 12 in leap years)
  // For simplicity, we use Sept 11.
  const isLeap = (gregorianYear + 1) % 4 === 0;
  const newYearDay = isLeap ? 12 : 11;

  if (
    gregorianMonth > 9 ||
    (gregorianMonth === 9 && gregorianDay >= newYearDay)
  ) {
    ethiopianYear = gregorianYear - 7;
  }

  // Calculate month and day (approximate but enough for gap logic)
  // Each Ethiopian month has 30 days, except the 13th month (Pagume)
  // Let's use a more robust calculation if possible, or just the year/month for now.
  
  // Reference: Sept 11 is Meskerem 1 (Month 1)
  const reference = new Date(gregorianYear, 8, newYearDay); // Sept is 8 in JS Date
  if (date < reference) {
    reference.setFullYear(gregorianYear - 1);
    // Check leap year for previous year
    const isPrevLeap = gregorianYear % 4 === 0;
    reference.setDate(isPrevLeap ? 12 : 11);
  }

  const diffDays = Math.floor((date.getTime() - reference.getTime()) / (1000 * 60 * 60 * 24));
  
  ethiopianMonth = Math.floor(diffDays / 30) + 1;
  ethiopianDay = (diffDays % 30) + 1;

  if (ethiopianMonth > 13) {
      // This shouldn't happen with correct reference, but just in case
      ethiopianMonth = 1;
  }

  return {
    year: ethiopianYear,
    month: ethiopianMonth,
    day: ethiopianDay
  };
};

export const getMonthGap = (startDate: Date, endDate: Date = new Date()) => {
    const start = getEthiopianDate(startDate);
    const end = getEthiopianDate(endDate);

    let yearDiff = end.year - start.year;
    let monthDiff = end.month - start.month;

    return yearDiff * 13 + monthDiff; // Ethiopian has 13 months
};

export const ethiopianToGregorian = (ethYear: number, ethMonth: number, ethDay: number) => {
  // Meskerem 1 of ethYear corresponds to Sept 11/12 of gregYear = ethYear + 7
  const gregYear = ethYear + 7;
  // Meskerem 1 is Sept 12 in the Gregorian year preceding a Gregorian leap year.
  // Gregorian leap years are 2020, 2024, 2028...
  // So Meskerem 1 is Sept 12 in 2019, 2023, 2027... (which are 2011, 2015, 2019 EC)
  const isMeskerem12 = (ethYear + 1) % 4 === 0;
  const meskerem1 = new Date(gregYear, 8, isMeskerem12 ? 12 : 11);
  
  const daysToAdd = (ethMonth - 1) * 30 + (ethDay - 1);
  meskerem1.setDate(meskerem1.getDate() + daysToAdd);
  
  return meskerem1;
};

export const parseEthiopianDateString = (dateStr: string) => {
    // Format: YYYY-MM-DD
    const [y, m, d] = dateStr.split("-").map(Number);
    return ethiopianToGregorian(y, m, d);
};

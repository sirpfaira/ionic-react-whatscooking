export function getElapsedTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const elapsedMilliseconds = now.getTime() - date.getTime();

  if (elapsedMilliseconds < 0) {
    return "Invalid date (date is in the future)";
  }

  const seconds = Math.floor(elapsedMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30); // Approximation
  const years = Math.floor(days / 365); // Approximation

  if (seconds < 60) {
    return `${seconds}s`;
  } else if (minutes < 60) {
    return `${minutes}m`;
  } else if (hours < 24) {
    return `${hours}h`;
  } else if (days < 30) {
    return `${days}d`;
  } else if (months < 12) {
    return `${months}mon`;
  } else {
    return `${years}y`;
  }
}

export const getFlagUrl = (country: string | null) => {
  if (country) {
    const code = countries.find((i) => i.name === country)?.code;
    if (code) {
      return `https://flagsapi.com/${code}/flat/64.png`;
    }
  }
  return "";
};

const countries = [
  { code: "AN", name: "Netherlands" },
  { code: "AO", name: "Angola" },
  { code: "AU", name: "Australia" },
  { code: "NG", name: "Nigeria" },
  { code: "ZW", name: "Zimbabwe" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
];

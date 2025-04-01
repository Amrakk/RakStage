const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "minute"],
    [24, "hour"],
    [30, "day"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
];

export function calculateTimeDiff(lastTimestamp: Date, prefix = ""): string {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastTimestamp.getTime()) / 1000);

    let value = diff;
    let unit: Intl.RelativeTimeFormatUnit = "second";

    for (const [threshold, intervalUnit] of intervals) {
        if (value < threshold) break;
        value = Math.floor(value / threshold);
        unit = intervalUnit;
    }

    return `${prefix}${new Intl.RelativeTimeFormat("en-US", {
        numeric: "auto",
    }).format(-value, unit)}`;
}

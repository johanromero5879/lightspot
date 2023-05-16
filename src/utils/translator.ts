export const translateMonth = (month: string)  => {
    if (month === "Jan") return "Ene";
    if (month === "Apr") return "Abr";
    if (month === "Aug") return "Ago";
    if (month === "Dec") return "Dic";

    return month;
}

export const translatePeriodOfDay = (periodOfDay: string) => {
    if (periodOfDay === "Early morning") return "Madrugada";
    if (periodOfDay === "Morning") return "Mañana";
    if (periodOfDay === "Afternoon") return "Tarde";
    if (periodOfDay === "Evening") return "Noche";

    return periodOfDay;
}
export const translateMonth = (month: string)  => {
    if (month === "Jan") return "Ene";
    if (month === "Apr") return "Abr";
    if (month === "Aug") return "Ago";
    if (month === "Dec") return "Dic";

    return month;
}

export const translateTimeofDay = (timeOfDay: string) => {
    if (timeOfDay === "Early morning") return "Madrugada";
    if (timeOfDay === "Morning") return "Mañana";
    if (timeOfDay === "Afternoon") return "Tarde";
    if (timeOfDay === "Evening") return "Noche";

    return timeOfDay;
}
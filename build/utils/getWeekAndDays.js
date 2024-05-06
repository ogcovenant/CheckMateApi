"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekAndDays = void 0;
const getWeekAndDays = (date) => {
    const weekDays = [];
    const sunday = new Date(date.getTime());
    sunday.setDate(date.getDate() - date.getDay());
    for (let i = 0; i < 7; i++) {
        const day = new Date(sunday.getTime());
        day.setDate(sunday.getDate() + i);
        weekDays.push(day.toLocaleDateString());
    }
    return weekDays;
};
exports.getWeekAndDays = getWeekAndDays;

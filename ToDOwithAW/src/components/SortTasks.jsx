import React from "react";

function SortTasks(tasks = [], filterOption = "All") {
    if (!Array.isArray(tasks)) return [];

    const now = new Date();
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const isLate = (dueDate) => {
        if (!dueDate) return false;
        // Convert both dates to YYYY-MM-DD format for comparison
        const dueDateStr = new Date(dueDate).toLocaleDateString('en-CA');
        const currentDateStr = currentDate.toLocaleDateString('en-CA');
        return dueDateStr < currentDateStr;
    };

    // Separate tasks into uncompleted and completed
    const uncompletedTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    // Sort by age within each group
    const sortByAge = (a, b) => (b.taskAge || 0) - (a.taskAge || 0);

    // Organize uncompleted tasks
    const uncompleted_critical_late = uncompletedTasks.filter(t => t.criticaltask && isLate(t.duedate)).sort(sortByAge);
    const uncompleted_normal_late = uncompletedTasks.filter(t => !t.criticaltask && isLate(t.duedate)).sort(sortByAge);
    const uncompleted_critical_ontime = uncompletedTasks.filter(t => t.criticaltask && !isLate(t.duedate)).sort(sortByAge);
    const uncompleted_normal_ontime = uncompletedTasks.filter(t => !t.criticaltask && !isLate(t.duedate)).sort(sortByAge);

    // Organize completed tasks
    const completed_critical_late = completedTasks.filter(t => t.criticaltask && isLate(t.duedate)).sort(sortByAge);
    const completed_normal_late = completedTasks.filter(t => !t.criticaltask && isLate(t.duedate)).sort(sortByAge);
    const completed_critical_ontime = completedTasks.filter(t => t.criticaltask && !isLate(t.duedate)).sort(sortByAge);
    const completed_normal_ontime = completedTasks.filter(t => !t.criticaltask && !isLate(t.duedate)).sort(sortByAge);

    return [
        ...uncompleted_critical_late,
        ...uncompleted_normal_late,
        ...uncompleted_critical_ontime,
        ...uncompleted_normal_ontime,
        ...completed_critical_late,
        ...completed_normal_late,
        ...completed_critical_ontime,
        ...completed_normal_ontime
    ];
}

export default SortTasks;
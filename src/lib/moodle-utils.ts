import { DateTime } from 'luxon';
import { MoodleTask } from './types/moodle';
import { $localSettings } from './user/settings-store';

export function sortTasks(a: MoodleTask, b: MoodleTask): number {
    const { completedMoodleTasks } = $localSettings.get();

    // Sort by completion status
    const aDone = completedMoodleTasks.includes(a.id);
    const bDone = completedMoodleTasks.includes(b.id);
    if(aDone && !bDone) return 1;
    if(!aDone && bDone) return -1;

    // Sort by overdue status
    const aOverdue = a.due < DateTime.now();
    const bOverdue = b.due < DateTime.now();
    if(aOverdue && !bOverdue) return -1;
    if(!aOverdue && bOverdue) return 1;

    // Sort by due date
    const diff = a.due.diff(b.due).as('milliseconds');
    if(diff !== 0) return diff;

    // Sort alphabetically
    const aName = a.title.toLocaleLowerCase();
    const bName = b.title.toLocaleLowerCase();
    if(aName < bName) return -1;
    if(aName > bName) return 1;
}

/**
 * Mark the given task as completed.
 */
export function completeTask(task: MoodleTask) {
    const { completedMoodleTasks } = $localSettings.get();
    const set = new Set(completedMoodleTasks);

    if(set.has(task.id)) {
        set.delete(task.id);
    } else {
        set.add(task.id);
    }

    $localSettings.setKey('completedMoodleTasks', [...set]);
}
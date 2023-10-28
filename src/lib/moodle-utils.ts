import { DateTime } from 'luxon';
import { MoodleTask } from './types/moodle';
import { $localSettings } from './user/settings-store';
import { patchMoodleTask, patchUser, postMigrateMoodleTasks } from './api/api';
import { $user } from './user/user-store';

export function sortTasks(a: MoodleTask, b: MoodleTask): number {
    // Sort by completion status
    if(a.completed_at && !b.completed_at) return 1;
    if(!a.completed_at && b.completed_at) return -1;

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

export async function migrateOldTasks() {
    const tasks = $localSettings.get().completedMoodleTasks;
    if(tasks.length === 0) return;
    await postMigrateMoodleTasks(tasks);
    $localSettings.setKey('completedMoodleTasks', []);
}

export async function disableMoodle() {
    const updatedUser = await patchUser({
        moodle_user_id: null,
        moodle_token: null
    });

    $user.set(updatedUser);
}
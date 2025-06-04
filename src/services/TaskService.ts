import { GenericService } from './GenericService';
import { Task, CreateTask } from '../models/Task';

class TaskService extends GenericService<Task, CreateTask> {
    constructor() {
        super(`${import.meta.env.VITE_API_GESTION}/tasks`);
    }
}

export const taskService = new TaskService();
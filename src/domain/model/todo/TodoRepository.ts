import {Todo} from "./Todo";

export abstract class TodoRepository {
    abstract getAll(): Promise<Todo[]>;
}

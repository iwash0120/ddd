import {Todo} from "./Todo";

export abstract class TodoService {
    abstract create(value: string): Promise<Todo>;

    abstract done(id: string): Promise<Todo>;

    abstract update(id: string, value: string): Promise<Todo>;
}

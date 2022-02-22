import {TodoRepository} from "../domain/model/todo/TodoRepository";
import {Todo} from "../domain/model/todo/Todo";
import {v4} from "uuid";
import {TodoService} from "../domain/model/todo/TodoService";

export class TodoRepositoryImpl implements TodoRepository, TodoService {
    private readonly items: Map<string, Todo> = new Map<string, Todo>();

    async create(value: string): Promise<Todo> {
        const item: Todo = {
            id: v4(),
            value,
            status: "pending",
        };

        this.items.set(item.id, item);

        return item;
    }

    async done(id: string): Promise<Todo> {
        let item = this.items.get(id);
        if (!item || item.status !== "pending") {
            throw new Error();
        }

        item = {
            ...item,
            status: "done",
        };

        this.items.set(item.id, item);

        return item;
    }

    async getAll(): Promise<Todo[]> {
        const items: Todo[] = [];
        this.items.forEach(item => {
            items.push(item);
        })
        return items;
    }

    async update(id: string, value: string): Promise<Todo> {
        let item = this.items.get(id);
        if (!item) {
            throw new Error();
        }

        item = {
            ...item,
            value,
        };

        this.items.set(id, item);

        return item;
    }
}

import {TodoRepository} from "../domain/model/todo/TodoRepository";
import {TodoRepositoryImpl} from "../infrastructure/TodoRepositoryImpl";
import {TodoService} from "../domain/model/todo/TodoService";

export class ServiceLocator {
    private static _instance: ServiceLocator | null;
    public static get instance(): ServiceLocator {
        if (ServiceLocator._instance === null) {
            ServiceLocator._instance = new ServiceLocator();
        }
        return ServiceLocator._instance;
    }

    public get todoRepository(): TodoRepository {
        return this._todoRepository;
    }

    public get todoService(): TodoService {
        return this._todoRepository;
    }

    private readonly _todoRepository: TodoRepositoryImpl;

    private constructor() {
        this._todoRepository = new TodoRepositoryImpl();
    }
}

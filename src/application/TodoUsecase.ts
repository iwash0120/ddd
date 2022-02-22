import {atomFamily, selectorFamily, useRecoilCallback, useRecoilTransaction_UNSTABLE} from "recoil";
import {ServiceLocator} from "../foundation/ServiceLocator";
import {Todo} from "../domain/model/todo/Todo";
import {entityStore} from "./EntityStore";

const todoItemsAtom = atomFamily<{
    status: "pending" | "loading" | "loaded",
    items: string[],
}, {
    filter?: string | null,
}>({
    key: "todoListState",
    default: {
        status: "pending",
        items: [],
    },
    effects: [(param) => {

    }],
});

export const todoItems = selectorFamily<{
    status: "pending" | "loading" | "loaded",
    items: Todo[],
}, {
    filter?: string | null,
}>({
    key: "todoListState2",
    get: (param) => ({get}) => {
        const state = get(todoItemsAtom(param));
        const entities = get(entityStore);
        return {
            ...state,
            items: state.items.map(it => entities.todo[it]),
        };
    },
});

export function useTodoUsecase() {
    const fetchTodoItems = useRecoilCallback(({snapshot, set}) => async (param: { filter?: string | null }) => {
        const sp = await snapshot.getPromise(todoItemsAtom(param));
        if (sp.status === "pending") {
            set(todoItemsAtom(param), old => ({
                ...old,
                status: "loading" as const,
            }));
            const items = await ServiceLocator.instance.todoRepository.getAll();
            set(entityStore, old => ({
                ...old,
                todo: Object.fromEntries(items.map(it => [it.id, it])),
            }))
            set(todoItemsAtom(param), old => ({
                ...old,
                items: items.map(it => it.id),
                status: "loaded" as const,
            }));
        }
    }, []);

    const createTodo = useRecoilTransaction_UNSTABLE(({get, set}) => async (value: string) => {
        const todo = await ServiceLocator.instance.todoService.create(value);
        set(entityStore, old => ({
            ...old,
            todo: {
                ...old.todo,
                [todo.id]: todo,
            },
        }));
    }, []);

    const updateTodo = useRecoilCallback(({set}) => async (id: string, value: string) => {
        const todo = await ServiceLocator.instance.todoService.update(id, value);
        set(entityStore, old => ({
            ...old,
            todo: {
                ...old.todo,
                [todo.id]: todo,
            },
        }));
    }, []);

    const doneTodo = useRecoilCallback(({set}) => async (id: string) => {
        const todo = await ServiceLocator.instance.todoService.done(id);
        set(entityStore, old => ({
            ...old,
            todo: {
                ...old.todo,
                [todo.id]: todo,
            },
        }));
    }, []);

    return {
        fetchTodoItems,
        createTodo,
        updateTodo,
        doneTodo,
    };
}


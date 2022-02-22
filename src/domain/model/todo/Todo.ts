export type Todo = {
    id: string,
    value: string;
    status: TodoStatus,
}

export type TodoStatus = "pending" | "done";

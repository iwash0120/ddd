import {Todo} from "../domain/model/todo/Todo";
import {atom} from "recoil";

type EntityStore = {
    todo: Record<Todo["id"], Todo>,
};

export const entityStore = atom<EntityStore>({
    key: "entityStore",
    default: {
        todo: {},
    },
});

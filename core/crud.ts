import fs from "fs"; // ES6
import { v4 as uuid } from "uuid";

const DB_FILE_PATH = "./core/db";

type UUID = string;

interface Todo {
    id: UUID;
    date: string;
    content: string;
    done: boolean;
}

function create(content: string): Todo {
    const todo: Todo = {
        id: uuid(),
        date: new Date().toISOString(),
        content: content,
        done: false,
    };

    const todos: Array<Todo> = [...read(), todo];

    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify(
            {
                todos: todos,
            },
            null,
            2
        )
    );

    return todo;
}

export function read(): Array<Todo> {
    const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const db = JSON.parse(dbString || "{}");

    if (!db.todos) {
        return [];
    }

    return db.todos;
}

function update(id: UUID, todo: Partial<Todo>): Todo {
    let updatedTodo;
    const dbTodos = read();

    dbTodos.forEach((dbTodo) => {
        if (dbTodo.id === id) {
            updatedTodo = Object.assign(dbTodo, todo);
        }
    });

    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify(
            {
                todos: dbTodos,
            },
            null,
            2
        )
    );

    if (!updatedTodo) {
        throw new Error("Provide a valid ID.");
    }

    return updatedTodo;
}

function deleteById(id: UUID): void {
    const dbTodos = read();
    const updatedTodos = dbTodos.filter((dbtodo) => dbtodo.id !== id);

    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify(
            {
                todos: updatedTodos,
            },
            null,
            2
        )
    );
}

function clearDB(): void {
    fs.writeFileSync(DB_FILE_PATH, "");
}

// [SIMULATION]
clearDB();
create("Primeira TODO");
const secondTodoId = create("Segunda TODO").id;
update(secondTodoId, { content: "Segunda TODO alterada.", done: true });
deleteById(secondTodoId);

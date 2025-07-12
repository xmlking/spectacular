/*
  Remote Functions RFC
  https://github.com/sveltejs/kit/discussions/13897
*/

import { error } from '@sveltejs/kit';
import { z } from 'zod/v4';
import { command, form, prerender, query } from '$app/server';

type Todo = {
  id: string;
  text: string;
  done: boolean;
};

const todos: Todo[] = [];

/*
  queries are for reading dynamic data from the server:
  - they're thenable and can be awaited
  - they provide properties like `pending` and `current`
    and methods like `override` or `withOverride` for optimistic UI updates
    and `refresh` for refetching the data
  - cached in memory for as long as they're actively used
  - refreshing or overriding a query will update every
    occurence of it on the page
*/
export const getTodos = query(async () => {
  return todos;
});

/*
  forms are the preferred way to write data to the server:
  - the form object has properties like `method`, `action` and `onsubmit`
    that can be spread onto a `<form>` element for progressive enhancement
  - all the queries on the page are automatically refreshed after a form submission
  - there's also properties like `result` containing the return values and
    `enhance` to customize how the form is progressively enhanced
*/
export const addTodo = form(async (data) => {
  const text = data.get('text') as string;
  if (!text) error(400, 'Todo text cannot be empty');

  todos.push({ id: crypto.randomUUID(), text, done: false });

  // single flight mutation
  // return updated data along with the form result
  await getTodos().refresh();
});

export const deleteTodo = form(async (data) => {
  const id = data.get('id') as string;
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) error(404, 'Todo not found');

  // only for demonstration
  if (Math.random() < 0.2) error(500, 'This is a random error when deleting a todo! 🎉');

  todos.splice(index, 1);
});

/*
  - commands are an alternative way of writing data to the server
    using JavaScript if you don't need progressive enhancement
  - if your `query/prerender/command` receives arguments it's required
    to pass a validation schema or 'unchecked' as the first argument
*/
export const toggleTodo = command(z.string(), async (id) => {
  const todo = todos.find((t) => t.id === id);
  if (!todo) error(404, 'Todo not found');

  // simulate optimistic UI updates
  await new Promise((resolve) => setTimeout(resolve, 2000));

  todo.done = !todo.done;
});

/*
  - ⚠️ currently prerendering doesn't work because the build fails
  - prerender functions are like queries except they're invoked at
    build time to prerender the result
  - useful for data that changes at most once per redeployment
  - you can use prerender functions on pages that are otherwise dynamic
    for blazingly fast partial prerendering of your data
  - there's more about prerendering functions in the RFC
*/
export const getTime = prerender(() => {
  return new Date().toLocaleTimeString();
});

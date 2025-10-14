# Routing

Routing in this stack is designed to be modular and flexible, allowing you to use the same way on how you define routes in a plain ExpressJS application or in other ways provided by the stack.

Routing connects to Controllers or the API handler. So we will provide 
a few examples on how you can define routes in this stack.

We have few ways to define routes in this stack:

- Directly in the controller
- Traditional ExpressJS way

## Directly in the Controller

You can define routes directly in the controller using the `defineRoute` method. This method is a syntactic sugar for `router.get`, `router.post`, etc., and allows you to define routes in a more readable way.

```ts
// controllers/book_controller.ts
const book = createRoute()

book.defineRoute('POST /books', (req, res) => {
  // Logic to create a book
  res.send('Book created');
});

book.defineRoute('GET /books', (req, res) => {
  res.send('List of books');
});

// Export the router instance
export default book.router;
```

`createRoute` creates a router instance similar to `express.Router()`, and you can use it to define routes in a modular way.

Once we have defined the routes in the controller, we can use it in the route definition.

```ts
// middlewares.ts
export default defineMiddlewares(({ app }) => {
    // GET /book
    app.use('/', bookController)
});
```

## Traditional ExpressJS Way

We create controllers and call them in the route definition.

```ts
// controllers/book_controller.ts

export const createBook = (req, res) => {
  // Logic to create a book
  res.send('Book created');
};
```

Next, we call the controller in the route definition using the `defineRoute` method.

The `defineRoute` method is a syntactic sugar for `router.get`, `router.post`, etc. It allows you to define routes in a more readable way.

It it still using the ExpressJS router under the hood, so you can use all the features of ExpressJS.

```ts
// routes.ts
import bookController from '#/controllers/book_controller';
export default function({ defineRoute }: CreateAppContext) {
    defineRoute('POST /books', bookController.createBook);

    // defineRoute is a syntactic sugar
    defineRoute('GET /books', (req, res) => {
        res.send('List of books');
    });
}
```

 
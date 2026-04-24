# ShopFlow Backend

Lightweight Express API for the ShopFlow frontend.

## Install

```bash
cd backend
npm install
```

## Run (dev)

```bash
npm run dev
```

Server starts on `http://localhost:3001`.

## Run alongside frontend

Use two terminals:

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
npm run dev
```

## Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /products`
- `GET /products/:id`
- `GET /cart`
- `POST /cart`
- `PATCH /cart/:id`
- `DELETE /cart/:id`
- `DELETE /cart`
- `POST /orders`
- `POST /promo-codes/validate`

## Pre-seeded credentials

- Email: `test@shopflow.dev`
- Password: `Test1234!`

## Intentional Bugs

- `BUG-001` (`auth.js`): `POST /auth/login` always returns generic `Invalid email or password` for both unknown email and wrong password.
- `BUG-002` (frontend in `src/api/cart.ts`): 600ms delay before cart quantity update is client-side.
- `BUG-003` (`promoCodes.js`): `POST /promo-codes/validate` accepts any non-empty code and returns a 10% discount (except known expired code).
- `BUG-004` (frontend): error page go-back behavior is client-side.

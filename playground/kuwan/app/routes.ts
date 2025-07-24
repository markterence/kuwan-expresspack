// import './controllers/users_controller'
// import './modules/client/routes';

import type { RouteContext } from "@markterence/kuwan-expresspack";

import user_controller from './controllers/users_controller';

export default function ({ defineRoute, router, app }: RouteContext) {
    router.use('/', user_controller);
}
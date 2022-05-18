import { createRouter, createWebHashHistory } from "vue-router";
// import layout from "../layout/index.vue";
// const routes = [
// 	{
// 		path: "/",
// 		component: layout,
// 		redirect: "/page1",
// 		children: {
// 			path: "/page1",
// 			name: "page1",
// 			component: () => import("../page/buildPage/index.vue")
// 		},
// 	}
// ];
const router = createRouter({
	history: createWebHashHistory(),
	routes:[
        {
            path:'/',
            component:() => import("../page/buildPage/index.vue"),
        }
    ]
});

// console.log('routes',routes)
export default router;
// export { routes };

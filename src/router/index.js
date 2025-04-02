import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        redirect: '/similar-anime',
        children: [
            {
                path: 'similar-anime',
                name: 'SimilarAnime',
                component: () => import('../views/SimilarAnime.vue'),
                meta: { title: '相似动画' }
            },
            {
                path: 'recommendation',
                name: 'Recommendation',
                component: () => import('../views/Recommendation.vue'),
                meta: { title: '个性化推荐' }
            },
            {
                path: 'about',
                name: 'About',
                component: () => import('../views/About.vue'),
                meta: { title: '关于本站' }
            }
        ]
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router 
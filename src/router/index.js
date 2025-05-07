import { createRouter, createWebHashHistory } from "vue-router";

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
                meta: { title: '个性推荐' }
            },
            {
                path: 'distribution',
                name: 'Distribution',
                component: () => import('../views/Distribution.vue'),
                meta: { title: '动画分布' }
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
    history: createWebHashHistory(),
    routes
})

router.afterEach((to) => {
    const defaultTitle = 'Bangumi Match';
    document.title = to.meta.title || defaultTitle;
});

export default router 
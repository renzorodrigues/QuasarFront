
const routes = [
  {
    path: '/login',
    component: () => import('pages/Login.vue'),
    beforeEnter (to, from, next) {
      if (localStorage.getItem('token') != null) {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/register',
    component: () => import('pages/Register.vue'),
    beforeEnter (to, from, next) {
      if (localStorage.getItem('token') != null) {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    beforeEnter (to, from, next) {
      if (localStorage.getItem('token') != null) {
        next()
      } else {
        next({
          path: '/login'
        })
      }
    },
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
        beforeEnter (to, from, next) {
          if (localStorage.getItem('token') != null) {
            next()
          } else {
            next({
              path: '/login'
            })
          }
        }
      },
      {
        path: '/atendidos',
        component: () => import('pages/Atendidos.vue'),
        beforeEnter (to, from, next) {
          if (localStorage.getItem('token') != null) {
            next()
          } else {
            next({
              path: '/login'
            })
          }
        }
      },
      {
        path: '/relatorio',
        component: () => import('pages/Relatorio.vue'),
        beforeEnter (to, from, next) {
          if (localStorage.getItem('token') != null) {
            next()
          } else {
            next({
              path: '/login'
            })
          }
        }
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes

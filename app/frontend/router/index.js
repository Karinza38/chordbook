import { createRouter, createWebHistory } from '@ionic/vue-router'
import TabsView from '@/views/TabsView.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/tabs',
    component: TabsView,
    children: [
      {
        path: '',
        redirect: '/home'
      },

      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
        meta: { selected: 'home' }
      },
      {
        path: '/discover',
        name: 'discover',
        component: () => import('@/views/DiscoverView.vue'),
        meta: { selected: 'discover' }
      },
      {
        path: '/library',
        name: 'library',
        props: route => ({ searchParams: route.query }),
        component: () => import('@/views/LibraryView.vue'),
        meta: { selected: 'library' }
      },
      {
        path: '/artists',
        name: 'artists',
        component: () => import('@/views/ArtistListView.vue'),
        meta: { selected: 'artists' }
      },
      {
        path: '/artists/:id',
        name: 'artist',
        props: true,
        component: () => import('@/views/ArtistView.vue')
      },
      {
        path: '/artists/:id/tracks',
        name: 'artist.tracks',
        props: true,
        component: () => import('@/views/TrackListView.vue')
      },
      {
        path: '/artists/:id/albums',
        name: 'artist.albums',
        component: () => import('@/views/AlbumListView.vue')
      },
      {
        path: '/albums/:id',
        name: 'album',
        props: true,
        component: () => import('@/views/AlbumView.vue')
      },
      {
        path: '/tracks/:id',
        name: 'track',
        props: route => ({ id: route.params.id, type: 'track' }),
        component: () => import('@/views/SongsheetView.vue')
      },
      {
        path: '/genres/:id',
        name: 'genre',
        props: true,
        component: () => import('@/views/GenreView.vue'),
        meta: { selected: 'discover' }
      },
      {
        path: '/genres/:id/tracks',
        name: 'genre.tracks',
        props: true,
        component: () => import('@/views/TrackListView.vue'),
        meta: { selected: 'discover' }
      },
      {
        path: '/genres/:id/albums',
        name: 'genre.albums',
        component: () => import('@/views/AlbumListView.vue'),
        meta: { selected: 'discover' }
      },
      {
        path: '/genres/:id/artists',
        name: 'genre.artists',
        props: true,
        component: () => import('@/views/ArtistListView.vue'),
        meta: { selected: 'discover' }
      },
      {
        path: '/songsheets',
        name: 'songsheets',
        component: () => import('@/views/SongsheetListView.vue'),
        meta: { selected: 'songs' }
      },
      {
        path: '/setlists',
        name: 'setlists',
        component: () => import('@/views/SetlistListView.vue'),
        meta: { selected: 'setlists' }
      },
      {
        path: '/setlists/:id',
        name: 'setlist',
        props: true,
        component: () => import('@/views/SetlistDetailView.vue'),
        meta: { selected: 'setlists' }
      }
    ]
  },
  {
    path: '/songsheets/new',
    name: 'songsheet.new',
    component: () => import('@/views/SongsheetEditorView.vue'),
    meta: { selected: 'songs' }
  },
  {
    path: '/songsheets/:id/edit',
    name: 'songsheet.edit',
    props: true,
    component: () => import('@/views/SongsheetEditorView.vue'),
    meta: { selected: 'songs' }
  },
  {
    path: '/songsheets/:id',
    name: 'songsheet',
    props: route => ({ id: route.params.id, type: 'songsheet' }),
    component: () => import('@/views/SongsheetView.vue'),
    meta: { selected: 'songs' }
  },
  {
    path: '/tuner',
    name: 'tuner',
    component: () => import('@/views/TunerView.vue')
  },
  {
    path: '/:path(.*)*',
    name: '404',
    component: () => import('@/views/NotFound.vue'),
    beforeEnter (to, from, next) {
      if (to.params.path || !to.redirectedFrom) {
        next()
      } else {
        console.log(to.redirectedFrom)
        // Preserve path of View that redirected here
        next({
          name: '404',
          replace: true,
          // Convert previous path into array
          params: { path: to.redirectedFrom.path.slice(1).split('/') },
          query: to.redirectedFrom.query,
          hash: to.redirectedFrom.hash
        })
      }
    }
  },
  {
    path: '/signup',
    name: 'signup',
    components: {
      modal: () => import('@/views/UserSignupModal.vue')
    }
  },
  {
    path: '/signin',
    name: 'signin',
    components: {
      modal: () => import('@/views/UserSigninModal.vue')
    }
  }
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

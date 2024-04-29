/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'
import { Route as ContestsContestIdIndexImport } from './routes/contests/$contestId.index'
import { Route as ContestsContestIdLeaderboardImport } from './routes/contests/$contestId.leaderboard'

// Create/Update Routes

const AboutRoute = AboutImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const ContestsContestIdIndexRoute = ContestsContestIdIndexImport.update({
  path: '/contests/$contestId/',
  getParentRoute: () => rootRoute,
} as any)

const ContestsContestIdLeaderboardRoute =
  ContestsContestIdLeaderboardImport.update({
    path: '/contests/$contestId/leaderboard',
    getParentRoute: () => rootRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/contests/$contestId/leaderboard': {
      preLoaderRoute: typeof ContestsContestIdLeaderboardImport
      parentRoute: typeof rootRoute
    }
    '/contests/$contestId/': {
      preLoaderRoute: typeof ContestsContestIdIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  AboutRoute,
  ContestsContestIdLeaderboardRoute,
  ContestsContestIdIndexRoute,
])

/* prettier-ignore-end */

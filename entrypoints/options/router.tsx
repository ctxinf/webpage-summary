import {
  createHashRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router';
import { OptionsLayout } from './layout/OptionsLayout';
import {
  DetailRoutePlaceholder,
  RoutePlaceholder,
} from './pages/RoutePlaceholder';

function ModelRoutes() {
  return (
    <>
      <h1 className="my-4 pl-0 text-3xl font-bold">Models</h1>
      <Outlet />
    </>
  );
}

function PromptRoutes() {
  return (
    <>
      <h1 className="my-4 pl-0 text-3xl font-bold">Prompts</h1>
      <Outlet />
    </>
  );
}

const optionsRouter = createHashRouter([
  {
    path: '/',
    Component: OptionsLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/general" replace />,
      },
      {
        path: 'general',
        element: <RoutePlaceholder title="General Setting" />,
      },
      {
        path: 'page-extraction',
        element: <RoutePlaceholder title="Page Extraction" />,
      },
      {
        path: 'models',
        Component: ModelRoutes,
        children: [
          {
            index: true,
            element: <RoutePlaceholder density="compact" />,
          },
          {
            path: 'create',
            element: <DetailRoutePlaceholder title="Create Model" />,
          },
          {
            path: 'edit',
            element: <DetailRoutePlaceholder title="Edit Model" />,
          },
        ],
      },
      {
        path: 'prompts',
        Component: PromptRoutes,
        children: [
          {
            index: true,
            element: <RoutePlaceholder density="compact" />,
          },
          {
            path: 'create',
            element: <DetailRoutePlaceholder title="Create Prompt" />,
          },
          {
            path: 'edit',
            element: <DetailRoutePlaceholder title="Edit Prompt" />,
          },
        ],
      },
      {
        path: 'site-customization',
        element: <RoutePlaceholder title="Site Customization" density="wide" />,
      },
      {
        path: 'appearance',
        element: <RoutePlaceholder title="Appearance Setting" density="wide" />,
      },
      {
        path: 'export_import',
        element: <RoutePlaceholder title="Export Import" density="compact" />,
      },
      {
        path: 'debug',
        element: <RoutePlaceholder title="Debug" density="compact" />,
      },
      {
        path: 'welcome',
        element: <RoutePlaceholder title="Welcome" density="compact" />,
      },
      {
        path: 'about',
        element: <Navigate to="/general" replace />,
      },
      {
        path: 'p1',
        element: <Navigate to="/general" replace />,
      },
      {
        path: 'p2',
        element: <Navigate to="/general" replace />,
      },
    ],
  },
]);

export function OptionsRouter() {
  return <RouterProvider router={optionsRouter} />;
}

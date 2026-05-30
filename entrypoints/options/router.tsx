import { createHashRouter, Navigate, RouterProvider } from 'react-router';
import { OptionsLayout } from './layout/OptionsLayout';
import { AppearancePage } from './pages/AppearancePage';
import { ExportImportPage } from './pages/ExportImportPage';
import { GeneralPage } from './pages/GeneralPage';
import { InterfacePage } from './pages/InterfacePage';
import { CreateModelPage } from './pages/models/CreateModelPage';
import { EditModelPage } from './pages/models/EditModelPage';
import { ModelsListPage } from './pages/models/ModelsListPage';
import { ModelsPage } from './pages/models/ModelsPage';
import { CreatePromptPage } from './pages/prompts/CreatePromptPage';
import { EditPromptPage } from './pages/prompts/EditPromptPage';
import { PromptsListPage } from './pages/prompts/PromptsListPage';
import { PromptsPage } from './pages/prompts/PromptsPage';
import { SiteCustomizationPage } from './pages/SiteCustomizationPage';
import { WelcomePage } from './pages/WelcomePage';

const optionsRouter = createHashRouter([
  {
    path: '/',
    Component: OptionsLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/interface" replace />,
      },
      {
        path: 'interface',
        Component: InterfacePage,
      },
      {
        path: 'general',
        Component: GeneralPage,
      },
      {
        path: 'models',
        Component: ModelsPage,
        children: [
          {
            index: true,
            Component: ModelsListPage,
          },
          {
            path: 'create',
            Component: CreateModelPage,
          },
          {
            path: 'edit',
            Component: EditModelPage,
          },
        ],
      },
      {
        path: 'prompts',
        Component: PromptsPage,
        children: [
          {
            index: true,
            Component: PromptsListPage,
          },
          {
            path: 'create',
            Component: CreatePromptPage,
          },
          {
            path: 'edit',
            Component: EditPromptPage,
          },
        ],
      },
      {
        path: 'site-customization',
        Component: SiteCustomizationPage,
      },
      {
        path: 'appearance',
        Component: AppearancePage,
      },
      {
        path: 'export_import',
        Component: ExportImportPage,
      },
      {
        path: 'welcome',
        Component: WelcomePage,
      },
      {
        path: 'p1',
        element: <Navigate to="/interface" replace />,
      },
      {
        path: 'p2',
        element: <Navigate to="/interface" replace />,
      },
    ],
  },
]);

export function OptionsRouter() {
  return <RouterProvider router={optionsRouter} />;
}

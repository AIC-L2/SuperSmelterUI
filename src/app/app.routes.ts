import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./components/_Operator/operator-overview/operator-overview.component').then((m) => m.OperatorOverviewComponent)
            // return import('./components/home/home.component').then((m) => m.HomeComponent)
        }
    },
    {
        path: 'home',
        loadComponent: () => {
            return import('./components/home/home.component').then((m) => m.HomeComponent)
        }
    },
    {
        path: 'reports',
        loadComponent: () => {
            return import('./components/reports/reports.component').then((m) => m.ReportsComponent)
        }
    },
    {
        path: 'recipeNew',
        loadComponent: () => {
            return import('./components/recipeNew/recipeNew.component').then((m) => m.RecipeNewComponent)
        } 
    },
    {
        path: 'recipe',
        loadComponent: () => {
            return import('./components/_Operator/operator-overview/operator-overview.component').then((m) => m.OperatorOverviewComponent)
        } 
    },
    {
        path: 'test',
        loadComponent: () => {
            return import('./components/_Operator/operator-overview/operator-overview.component').then((m) => m.OperatorOverviewComponent)
        } 
    }
];

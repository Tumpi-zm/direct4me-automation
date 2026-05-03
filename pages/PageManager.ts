import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';
import { WorkOrdersPage } from './WorkOrdersPage';
import { CreateWorkOrderModal } from './CreateWorkOrderModal';
import { SitesPage } from './SitesPage';
import { LockersPage } from './LockersPage';
import { AnnualPreventivePage } from './AnnualPreventivePage';
import { MyWorkPage } from './MyWorkPage';

/**
 * PageManager — single import point for all page objects.
 *
 * Usage in tests (via the pm fixture):
 *   await pm.onLoginPage.loginAs(users.ops);
 *   await pm.onDashboardPage.clickNeedsPlanningCard();
 */
export class PageManager {
  private readonly page: Page;

  readonly onLoginPage: LoginPage;
  readonly onDashboardPage: DashboardPage;
  readonly onWorkOrdersPage: WorkOrdersPage;
  readonly onCreateWorkOrderModal: CreateWorkOrderModal;
  readonly onSitesPage: SitesPage;
  readonly onLockersPage: LockersPage;
  readonly onAnnualPreventivePage: AnnualPreventivePage;
  readonly onMyWorkPage: MyWorkPage;

  constructor(page: Page) {
    this.page = page;

    this.onLoginPage = new LoginPage(page);
    this.onDashboardPage = new DashboardPage(page);
    this.onWorkOrdersPage = new WorkOrdersPage(page);
    this.onCreateWorkOrderModal = new CreateWorkOrderModal(page);
    this.onSitesPage = new SitesPage(page);
    this.onLockersPage = new LockersPage(page);
    this.onAnnualPreventivePage = new AnnualPreventivePage(page);
    this.onMyWorkPage = new MyWorkPage(page);
  }
}

import { BrowserRouter as Router, Routes, Route } from "react-router";
import { SubscriptionProvider } from "@/react-app/hooks/useSubscription";
import { UserProvider } from "@/react-app/hooks/useUser";
import HomePage from "@/react-app/pages/Home";
import CRM from "@/react-app/pages/CRM";
import HRM from "@/react-app/pages/HRM";
import SIM from "@/react-app/pages/SIM";
import UserRoles from "@/react-app/pages/UserRoles";
import Dashboard from "@/react-app/pages/Dashboard";
import Accounting from "@/react-app/pages/Accounting";
import Login from "@/react-app/pages/Login";
import SignUp from "@/react-app/pages/SignUp";
// Add preview imports
import DashboardPreview from "@/react-app/pages/preview/DashboardPreview";
import CRMPreview from "@/react-app/pages/preview/CRMPreview";
import HRMPreview from "@/react-app/pages/preview/HRMPreview";
import SIMPreview from "@/react-app/pages/preview/SIMPreview";
import AccountingPreview from "@/react-app/pages/preview/AccountingPreview";
import UserRolesPreview from "@/react-app/pages/preview/UserRolesPreview";
import DebugInfo from "@/react-app/components/DebugInfo";

export default function App() {
  return (
    <UserProvider>
      <SubscriptionProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/hrm" element={<HRM />} />
            <Route path="/sim" element={<SIM />} />
            <Route path="/roles" element={<UserRoles />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounting" element={<Accounting />} />
            {/* Preview routes */}
            <Route path="/preview/dashboard" element={<DashboardPreview />} />
            <Route path="/preview/crm" element={<CRMPreview />} />
            <Route path="/preview/hrm" element={<HRMPreview />} />
            <Route path="/preview/sim" element={<SIMPreview />} />
            <Route path="/preview/accounting" element={<AccountingPreview />} />
            <Route path="/preview/roles" element={<UserRolesPreview />} />
          </Routes>
          <DebugInfo />
        </Router>
      </SubscriptionProvider>
    </UserProvider>
  );
}

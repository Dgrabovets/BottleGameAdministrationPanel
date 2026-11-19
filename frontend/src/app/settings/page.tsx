"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PrivateRoute from "@/components/PrivateRoute/PrivateRoute";
import { SettingsForm } from "./_components/settings-from";

/** Game settings page */
export default function SettingsPage() {
  return (
    <PrivateRoute>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageName="Settings" />

        <div className="gap-8">
          <div>
            <SettingsForm />
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}

"use client";
import PrivateRoute from "@/components/PrivateRoute/PrivateRoute";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useState } from "react";
import { ModeratorsTable } from "@/components/Tables/moderators";
import { playersApi } from "@/api/playersApi";

/** Moderators page: the form to add a moderator and the list of moderators */
const ModeratorPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await playersApi.registerModerator(username, password);
      console.log("Moderator registered:", res);
      // The form could be reset or a message shown
      setUsername("");
      setPassword("");
      window.location.reload();
    } catch (error) {
      console.error("Failed to register the moderator:", error);
    }
  };

  return (
    <PrivateRoute>
      <div className="w-full p-4 sm:p-12.5 xl:p-15">
        <ShowcaseSection title="Add moderator">
          <form onSubmit={handleSubmit}>
            <InputGroup
              type="text"
              label="Username"
              className="mb-5 [&_input]:py-[15px]"
              placeholder="Enter the username"
              name="username"
              handleChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <InputGroup
              type="password"
              label="Password"
              className="mb-5 [&_input]:py-[15px]"
              placeholder="Enter your password"
              name="password"
              handleChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <div className="mb-4.5">
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
              >
                Add
              </button>
            </div>
          </form>
        </ShowcaseSection>
        <div className="my-4.5">
          <ModeratorsTable />
        </div>
      </div>
    </PrivateRoute>
  );
};

export default ModeratorPage;

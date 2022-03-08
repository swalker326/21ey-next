import "@aws-amplify/ui-react/styles.css";
import { useAppContext } from "../src/context/state";
import { Register } from "../src/forms/register/Register";
import { UserProfile } from "../src/components/UserProfile";

export const Profile = () => {
  const state = useAppContext();
  return (
    <Register>
      <style jsx global>
        {`
          body {
            background-color: ${state.theme.colorMode === "dark"
              ? "#525659"
              : "inhearit"};
            color: ${state.theme.colorMode === "dark" ? "#f8f9fa" : "black"};
          }
        `}
      </style>
      <UserProfile />
    </Register>
  );
};

export default Profile;

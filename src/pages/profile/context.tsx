import { Result } from "ahooks/lib/useRequest/src/types";
import { createContext, useContext } from "react";

type ReqType = Result<any, any>;

interface ProfileContextState {
  collectionReq: ReqType;
  listedReq: ReqType;
  createdReq: ReqType;
}

const ProfileContext = createContext({} as ProfileContextState);

export default ProfileContext;

// eslint-disable-next-line react-refresh/only-export-components
export const useProfileState = () => {
  const contextState = useContext(ProfileContext);
  return contextState;
};

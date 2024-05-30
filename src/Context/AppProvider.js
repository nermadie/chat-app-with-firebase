import React, { createContext, useContext, useMemo, useState } from "react";
import { AuthContext } from "./AuthProvider";
import useFirestore from "../hooks/useFirestore";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const { user } = useContext(AuthContext);
  const uid = user.uid;
  /*
        {
            name: "room name",
            description: "room description",
            members: ["uid1", "uid2"]
        }
    */
  // Find rooms that the current user is a member of
  const roomsCondition = useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      compareValue: uid,
    };
  }, [uid]);
  const rooms = useFirestore("rooms", roomsCondition);

  // Find members of a room
  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) || {},
    [rooms, selectedRoomId]
  );
  const usersCondition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: selectedRoom.members || [],
    };
  }, [selectedRoom.members]);
  const members = useFirestore("users", usersCondition);

  return (
    <AppContext.Provider
      value={{
        rooms,
        selectedRoom,
        members,
        isAddRoomVisible,
        setIsAddRoomVisible,
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        selectedRoomId,
        setSelectedRoomId,
      }}>
      {children}
    </AppContext.Provider>
  );
}

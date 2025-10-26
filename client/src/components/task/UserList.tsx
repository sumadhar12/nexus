import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { Listbox, Transition } from "@headlessui/react";
import { BsChevronExpand } from "react-icons/bs";
import { MdCheck } from "react-icons/md";
import { getInitials } from "../../utils";
import { RootState } from "../../redux/store";
import { User } from "../../types";

interface UserListProps {
  setTeam: (users: User[]) => void;
  team: User[];
}

const UserList: React.FC<UserListProps> = ({ setTeam, team }) => {
  const { user: currentUser } = useSelector(
    (state: RootState) => state.auth as { user: User | null }
  );
  const [data, setData] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>(team || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/user/get-all-users`
        );
        if (response.data) {
          const filteredUsers = response.data.filter(
            (user: User) => user.email !== currentUser?.email
          );
          setData(filteredUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (el: User[]) => {
    setSelectedUsers(el);
    setTeam(el);
  };

  useEffect(() => {
    if (team?.length > 0) {
      setSelectedUsers(team);
    }
  }, [team]);

  const isSelected = (userName: string) => {
    return selectedUsers.some((user) => user.name === userName);
  };

  return (
    <div>
      <p className="text-gray-300">Assign Task To: </p>
      <Listbox
        value={selectedUsers}
        onChange={(el) => handleChange(el)}
        multiple
      >
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded bg-gray-700 pl-3 pr-10 text-left px-3 py-2.5 2xl:py-3 sm:text-sm">
            <span className="block truncate text-white">
              {selectedUsers?.map((user) => user.name).join(", ")}
            </span>

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <BsChevronExpand
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {loading ? (
                <div className="py-2 px-4 text-gray-500 text-sm">
                  Loading users...
                </div>
              ) : data?.length > 0 ? (
                data.map((user, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-amber-100 text-amber-900" : "text-black"
                      }`
                    }
                    value={user}
                  >
                    {({ selected }) => (
                      <>
                        <div
                          className={clsx(
                            "flex items-center gap-2 truncate",
                            selected || isSelected(user.name)
                              ? "font-medium"
                              : "font-normal"
                          )}
                        >
                          <div className="w-6 h-6 rounded-full text-white flex items-center justify-center bg-violet-600">
                            <span className="text-center text-[10px]">
                              {getInitials(user.name)}
                            </span>
                          </div>
                          <span>{user.name}</span>
                        </div>
                        {isSelected(user.name) && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                            <MdCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))
              ) : (
                <div className="py-2 px-4 text-gray-500 text-sm">
                  No users found
                </div>
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default UserList;

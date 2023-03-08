import axios from 'axios';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import LatestUserTable from '../../../components/admin/LatestUserTable';
import PageNavigator from '../../../components/common/PageNavigator';
import AdminLayout from '../../../components/layout/AdminLayout';
import { LatestUserProfile } from '../../../utils/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const limit = 5;
let currentPageNo = 0;

const Users: NextPage<Props> = () => {
  const [users, setUsers] = useState<LatestUserProfile[]>();
  const [reachedToEnd, setReachedToEnd] = useState(false);

  // fetching all users
  const fetchAllUsers = (pageNo: number = currentPageNo) => {
    axios(`/api/user?pageNo=${pageNo}&limit=${limit}`)
      .then(({ data }) => {
        if (!data.users.length) {
          currentPageNo--;
          return setReachedToEnd(true);
        }

        setUsers(data.users);
      })
      .catch((err) => console.log(err));
  };

  const handleOnNextClick = () => {
    if (reachedToEnd) return;
    currentPageNo++;
    fetchAllUsers(currentPageNo);
  };
  const handleOnPrevClick = () => {
    if (currentPageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);

    currentPageNo--;
    fetchAllUsers(currentPageNo);
  };

  useEffect(fetchAllUsers, []);

  return (
    <AdminLayout>
      <h1 className="py-2 text-2xl font-semibold text-primary-dark transition dark:text-primary-light">
        Users
      </h1>
      <LatestUserTable users={users} />
      <div className="flex justify-end py-10">
        <PageNavigator
          onNextClick={handleOnNextClick}
          onPrevClick={handleOnPrevClick}
        />
      </div>
    </AdminLayout>
  );
};

export default Users;

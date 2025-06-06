import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from './Navbar';
import { FaRegImage, FaArrowDownWideShort, FaArrowRightLong } from 'react-icons/fa6';
import { BiDetail, BiHide, BiSolidBookmarkHeart } from 'react-icons/bi';
import { IoLocationSharp } from 'react-icons/io5';
import { BsClipboard2Heart, BsClipboardHeart } from 'react-icons/bs';
import { CgDanger } from 'react-icons/cg';

const fetchUsers = async () => {
  const response = await fetch('http://localhost:3000/api', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return response.json();
};

const toggleStatus = async (userId) => {
  const response = await fetch('http://localhost:3000/api/toggleStatus', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _id: userId }),
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Failed to toggle status');
  return response.json();
};

function Home() {
  const queryClient = useQueryClient();
  const [showShortlisted, setShowShortlisted] = useState(false);

  // Fetch users with React Query
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Toggle status mutation
  const mutation = useMutation({
    mutationFn: toggleStatus,
    onMutate: async (userId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(['users']);
      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData(['users']);
      // Optimistically update the user
      queryClient.setQueryData(['users'], (old) =>
        old.map((user) =>
          user._id === userId
            ? { ...user, shortlistStatus: !user.shortlistStatus }
            : user
        )
      );
      // Return context for rollback
      return { previousUsers };
    },
    onError: (err, userId, context) => {
      // Rollback on error
      queryClient.setQueryData(['users'], context.previousUsers);
    },
    onSettled: () => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries(['users']);
    },
  });

  // Toggle between all users and shortlisted users
  const displayedUsers = showShortlisted
    ? users.filter((user) => user.shortlistStatus)
    : users;

  if (isLoading)
    return (
      <div className="flex justify-center items-center w-full h-screen font-bold text-black">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center w-full h-screen font-bold text-black">
        {error.message || '404 Something went wrong!'}
      </div>
    );

  return (
    <div>
      <Navbar />
      {/* Sections */}
      <div className="flex text-[#3A312E] px-2 justify-between md:justify-center items-center">
        <div className="flex my-8 gap-4 px-2 justify-between md:justify-center items-center">
          <div className="flex flex-col gap-1 items-center justify-center">
            <BiDetail className="text-3xl md:text-5xl" />
            <span className="text-[10px] font-semibold md:text-base">Contact</span>
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <FaRegImage className="text-3xl md:text-5xl" />
            <span className="text-[10px] font-semibold md:text-base">Gallery</span>
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <IoLocationSharp className="text-3xl md:text-5xl" />
            <span className="text-[10px] font-semibold md:text-base">Map</span>
          </div>
        </div>
        <div className="flex my-8 text-[#3A312E] gap-4 px-2 justify-between md:justify-center items-center">
          <button
            onClick={() => setShowShortlisted(!showShortlisted)}
            className="flex flex-col gap-1 items-center justify-center"
          >
            <BsClipboard2Heart className="text-3xl md:text-5xl" />
            <span className="text-[10px] font-semibold md:text-base">
              {showShortlisted ? 'All Users' : 'Shortlisted'}
            </span>
          </button>
          <div className="flex flex-col gap-1 items-center justify-center">
            <FaArrowDownWideShort className="text-3xl md:text-5xl" />
            <span className="text-[10px] font-semibold md:text-base">Sort</span>
          </div>
        </div>
      </div>

      {/* Users Profile lists */}
      <div className="max-w-3xl mx-auto">
        {displayedUsers.length === 0 ? (
          <div className="text-center text-gray-500">
            {showShortlisted ? 'No shortlisted users found.' : 'No user profiles found.'}
          </div>
        ) : (
          displayedUsers.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-start p-6 mb-4 bg-[#FFF6EC] border border-gray-200 rounded-lg shadow-sm"
            >
              {/* Left Section: User Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {user.RoleName || 'N/A'}
                  </h2>
                </div>
                <div className="flex items-center my-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < parseFloat(user.rate?.split('/')[0] || 0)
                          ? 'black'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm font-semibold w-[80%] text-gray-600 my-3">
                  {user.description || 'N/A'}
                </p>
                <div className="flex items-center space-x-6 mt-3">
                  <div>
                    <p className="text-3xl font-semibold text-gray-800">
                      {user.project || '0'}
                    </p>
                    <p className="text-xs font-semibold text-gray-500">Projects</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold text-gray-800">
                      {user.year ? user.year - 2017 : '0'}
                    </p>
                    <p className="text-xs font-semibold text-gray-500">Years</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold text-gray-800">
                      {user.rate ? `$${user.rate.split('/')[0]}` : '$$'}
                    </p>
                    <p className="text-xs font-semibold text-gray-500">Price</p>
                  </div>
                </div>
                <div className="mt-2 text-2xl font-semibold flex flex-col">
                  <span className="flex items-center">+91 - {user.contactNumbers || 'N/A'}</span>
                </div>
              </div>

              {/* Right Section: Action Icons */}
              <div className="flex flex-col justify-center items-center space-y-3">
                <button className="flex flex-col justify-center items-center text-gray-600 hover:text-gray-800">
                  <FaArrowRightLong className="text-2xl" />
                  <span className="text-xs font-semibold">Details</span>
                </button>
                <button className="flex flex-col justify-center items-center text-gray-600 hover:text-gray-800">
                  <BiHide className="text-2xl" />
                  <span className="text-xs font-semibold">Hide</span>
                </button>
                <button
                  onClick={() => mutation.mutate(user._id)}
                  disabled={mutation.isLoading}
                  className="flex flex-col justify-center items-center text-gray-600 hover:text-gray-800"
                >
                  {user.shortlistStatus ? (
                    <BiSolidBookmarkHeart className="text-3xl" />
                  ) : (
                    <BsClipboardHeart className="text-2xl" />
                  )}
                  <span className="text-xs font-semibold">
                    {mutation.isLoading ? 'Toggling...' : 'Shortlist'}
                  </span>
                </button>
                <button className="flex flex-col justify-center items-center text-gray-600 hover:text-gray-800">
                  <CgDanger className="text-2xl" />
                  <span className="text-xs font-semibold">Report</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;